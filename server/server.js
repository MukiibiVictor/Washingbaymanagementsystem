import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { loadDatabase, saveDatabase } from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Load persistent database from file
const db = loadDatabase();

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userData } = user;
    userData.last_login = new Date().toISOString();
    res.json({ success: true, user: userData, token: 'mock-jwt-token-' + user.id });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

// Public user registration (creates viewer accounts only)
app.post('/api/auth/register', (req, res) => {
  const { email, name, password } = req.body;
  
  // Check if user already exists
  const existingUser = db.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, error: 'Email already registered' });
  }

  // Create new viewer account
  const newUser = {
    id: Date.now().toString(),
    email,
    name,
    password,
    role: 'viewer',
    created_at: new Date().toISOString()
  };
  
  db.users.push(newUser);
  saveDatabase(db);
  
  const { password: _, ...userData } = newUser;
  res.json({ success: true, user: userData });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    const userId = token.split('-').pop();
    const user = db.users.find(u => u.id === userId);
    if (user) {
      const { password: _, ...userData } = user;
      return res.json({ success: true, user: userData });
    }
  }
  res.status(401).json({ success: false, error: 'Unauthorized' });
});

// Users Routes
app.get('/api/users', (req, res) => {
  const users = db.users.map(({ password, ...user }) => user);
  res.json({ success: true, data: users });
});

app.get('/api/users/:id', (req, res) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (user) {
    const { password, ...userData } = user;
    res.json({ success: true, data: userData });
  } else {
    res.status(404).json({ success: false, error: 'User not found' });
  }
});

app.put('/api/users/:id/profile', (req, res) => {
  const userIndex = db.users.findIndex(u => u.id === req.params.id);
  if (userIndex !== -1) {
    db.users[userIndex] = { ...db.users[userIndex], ...req.body };
    saveDatabase(db);
    const { password, ...userData } = db.users[userIndex];
    res.json({ success: true, user: userData });
  } else {
    res.status(404).json({ success: false, error: 'User not found' });
  }
});

app.post('/api/users', (req, res) => {
  const newUser = {
    id: Date.now().toString(),
    ...req.body,
    created_at: new Date().toISOString()
  };
  db.users.push(newUser);
  saveDatabase(db);
  const { password, ...userData } = newUser;
  res.json({ success: true, user: userData });
});

app.delete('/api/users/:id', (req, res) => {
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index !== -1) {
    db.users.splice(index, 1);
    saveDatabase(db);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, error: 'User not found' });
  }
});

// Check-ins Routes
app.get('/api/checkins', (req, res) => {
  res.json({ success: true, data: db.checkins });
});

app.get('/api/checkins/pending', (req, res) => {
  const pending = db.checkins.filter(c => c.status === 'pending');
  res.json({ success: true, data: pending });
});

app.post('/api/checkins', (req, res) => {
  const newCheckin = {
    id: 'ci-' + Date.now(),
    ...req.body,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
  db.checkins.push(newCheckin);
  saveDatabase(db);
  res.json({ success: true, data: newCheckin });
});

app.put('/api/checkins/:id/confirm', (req, res) => {
  const index = db.checkins.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    db.checkins[index] = {
      ...db.checkins[index],
      ...req.body,
      status: 'confirmed',
      confirmed_at: new Date().toISOString()
    };
    
    const newTransaction = {
      id: 'tx-' + Date.now(),
      checkin_id: req.params.id,
      ...req.body,
      status: 'pending',
      created_at: new Date().toISOString(),
      image_url: db.checkins[index].image_url
    };
    db.transactions.push(newTransaction);
    saveDatabase(db);
    
    res.json({ success: true, transaction: newTransaction });
  } else {
    res.status(404).json({ success: false, error: 'Check-in not found' });
  }
});

// Transactions Routes
app.get('/api/transactions', (req, res) => {
  res.json({ success: true, data: db.transactions });
});

// Specific routes MUST come before parameterized routes
app.get('/api/transactions/pending', (req, res) => {
  const pending = db.transactions.filter(t => t.status === 'pending');
  res.json({ success: true, data: pending });
});

app.get('/api/transactions/credit', (req, res) => {
  const credit = db.transactions.filter(t => t.status === 'credit');
  res.json({ success: true, data: credit });
});

// Parameterized route comes last
app.get('/api/transactions/:id', (req, res) => {
  const transaction = db.transactions.find(t => t.id === req.params.id);
  if (transaction) {
    res.json({ success: true, data: transaction });
  } else {
    res.status(404).json({ success: false, error: 'Transaction not found' });
  }
});

app.post('/api/transactions/:id/payment', (req, res) => {
  const index = db.transactions.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    const { method, amount, created_by } = req.body;
    db.transactions[index].status = method === 'credit' ? 'credit' : 'paid';
    
    const payment = {
      id: 'pay-' + Date.now(),
      transaction_id: req.params.id,
      method,
      amount,
      created_by,
      created_at: new Date().toISOString()
    };
    db.payments.push(payment);
    saveDatabase(db);
    
    res.json({ success: true, payment });
  } else {
    res.status(404).json({ success: false, error: 'Transaction not found' });
  }
});

// Pricing Routes
app.get('/api/pricing', (req, res) => {
  res.json({ success: true, data: db.pricingRules });
});

app.put('/api/pricing/:id', (req, res) => {
  const index = db.pricingRules.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    db.pricingRules[index] = {
      ...db.pricingRules[index],
      minimum_price: req.body.minimum_price,
      updated_by: req.body.updated_by,
      updated_at: new Date().toISOString()
    };
    saveDatabase(db);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, error: 'Pricing rule not found' });
  }
});

// Dashboard Routes
app.get('/api/dashboard/stats', (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayTransactions = db.transactions.filter(t => {
    const txDate = new Date(t.created_at);
    return txDate >= today;
  });
  
  const paidTransactions = todayTransactions.filter(t => t.status === 'paid');
  const todayRevenue = paidTransactions.reduce((sum, t) => sum + t.price, 0);
  const vehiclesToday = todayTransactions.length;
  const outstandingCredit = db.transactions
    .filter(t => t.status === 'credit')
    .reduce((sum, t) => sum + t.price, 0);
  
  const revenueByVehicle = paidTransactions.reduce((acc, t) => {
    const existing = acc.find(r => r.vehicle_type === t.vehicle_type);
    if (existing) {
      existing.revenue += t.price;
    } else {
      acc.push({ vehicle_type: t.vehicle_type, revenue: t.price });
    }
    return acc;
  }, []);
  
  const revenueByService = paidTransactions.reduce((acc, t) => {
    const existing = acc.find(r => r.service_type === t.service_type);
    if (existing) {
      existing.revenue += t.price;
    } else {
      acc.push({ service_type: t.service_type, revenue: t.price });
    }
    return acc;
  }, []);
  
  res.json({
    success: true,
    data: {
      today_revenue: todayRevenue,
      vehicles_today: vehiclesToday,
      outstanding_credit: outstandingCredit,
      revenue_by_vehicle: revenueByVehicle,
      revenue_by_service: revenueByService,
      recent_transactions: db.transactions.slice(0, 10)
    }
  });
});

// Expenses Routes
app.get('/api/expenses', (req, res) => {
  res.json({ success: true, data: db.expenses });
});

app.post('/api/expenses', (req, res) => {
  const newExpense = {
    id: 'exp-' + Date.now(),
    ...req.body,
    created_at: new Date().toISOString()
  };
  db.expenses.push(newExpense);
  saveDatabase(db);
  res.json({ success: true, data: newExpense });
});

app.put('/api/expenses/:id', (req, res) => {
  const index = db.expenses.findIndex(e => e.id === req.params.id);
  if (index !== -1) {
    db.expenses[index] = {
      ...db.expenses[index],
      ...req.body,
      updated_at: new Date().toISOString()
    };
    saveDatabase(db);
    res.json({ success: true, data: db.expenses[index] });
  } else {
    res.status(404).json({ success: false, error: 'Expense not found' });
  }
});

app.delete('/api/expenses/:id', (req, res) => {
  const index = db.expenses.findIndex(e => e.id === req.params.id);
  if (index !== -1) {
    db.expenses.splice(index, 1);
    saveDatabase(db);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, error: 'Expense not found' });
  }
});

// Services Routes (Public - no auth required)
app.get('/api/services', (req, res) => {
  res.json({ success: true, data: db.services });
});

app.post('/api/services', (req, res) => {
  const newService = {
    id: 'srv-' + Date.now(),
    ...req.body,
    created_at: new Date().toISOString()
  };
  db.services.push(newService);
  saveDatabase(db);
  res.json({ success: true, data: newService });
});

app.put('/api/services/:id', (req, res) => {
  const index = db.services.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    db.services[index] = {
      ...db.services[index],
      ...req.body,
      updated_at: new Date().toISOString()
    };
    saveDatabase(db);
    res.json({ success: true, data: db.services[index] });
  } else {
    res.status(404).json({ success: false, error: 'Service not found' });
  }
});

app.delete('/api/services/:id', (req, res) => {
  const index = db.services.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    db.services.splice(index, 1);
    saveDatabase(db);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, error: 'Service not found' });
  }
});

// Footer Routes (Public read, superadmin write)
app.get('/api/footer', (req, res) => {
  res.json({ success: true, data: db.footer });
});

app.put('/api/footer', (req, res) => {
  db.footer = {
    ...db.footer,
    ...req.body,
    updated_at: new Date().toISOString()
  };
  saveDatabase(db);
  res.json({ success: true, data: db.footer });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ZORI Auto Spa API is running' });
});

app.listen(PORT, () => {
  console.log('🚀 Server running on http://localhost:' + PORT);
  console.log('📊 API endpoints available at http://localhost:' + PORT + '/api');
});
