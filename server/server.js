import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// In-memory database
const db = {
  users: [
    { id: '1', email: 'admin@zoriautospa.com', password: 'admin123', name: 'John Admin', role: 'superadmin', created_at: new Date().toISOString() },
    { id: '2', email: 'staff@zoriautospa.com', password: 'staff123', name: 'Mary Staff', role: 'admin', created_at: new Date().toISOString() },
    { id: '3', email: 'viewer@zoriautospa.com', password: 'viewer123', name: 'Tom Viewer', role: 'viewer', created_at: new Date().toISOString() }
  ],
  checkins: [
    {
      id: 'ci-001',
      camera_id: 1,
      image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'pending'
    },
    {
      id: 'ci-002',
      camera_id: 1,
      image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      status: 'pending'
    },
    {
      id: 'ci-003',
      camera_id: 1,
      image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      status: 'pending'
    }
  ],
  transactions: [
    {
      id: 'tx-001',
      checkin_id: 'ci-100',
      vehicle_type: 'SUV',
      service_type: 'Wash',
      plate_number: 'UBR123A',
      price: 15000,
      status: 'paid',
      admin_id: '1',
      admin_name: 'John Admin',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b'
    },
    {
      id: 'tx-002',
      checkin_id: 'ci-101',
      vehicle_type: 'Sedan',
      service_type: 'Wash & Wax',
      plate_number: 'UAH456B',
      price: 18000,
      status: 'paid',
      admin_id: '2',
      admin_name: 'Mary Staff',
      created_at: new Date(Date.now() - 5400000).toISOString(),
      image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70'
    }
  ],
  payments: [],
  pricingRules: [
    { id: '1', vehicle_type: 'Sedan', service_type: 'Wash', minimum_price: 10000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '2', vehicle_type: 'Sedan', service_type: 'Wash & Wax', minimum_price: 15000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '3', vehicle_type: 'SUV', service_type: 'Wash', minimum_price: 12000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '4', vehicle_type: 'SUV', service_type: 'Wash & Wax', minimum_price: 18000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '5', vehicle_type: 'Lorry', service_type: 'Wash', minimum_price: 20000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '6', vehicle_type: 'Fuso', service_type: 'Wash', minimum_price: 25000, updated_by: '1', updated_at: new Date().toISOString() }
  ]
};

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
  const { password, ...userData } = newUser;
  res.json({ success: true, user: userData });
});

app.delete('/api/users/:id', (req, res) => {
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index !== -1) {
    db.users.splice(index, 1);
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
    
    res.json({ success: true, transaction: newTransaction });
  } else {
    res.status(404).json({ success: false, error: 'Check-in not found' });
  }
});

// Transactions Routes
app.get('/api/transactions', (req, res) => {
  res.json({ success: true, data: db.transactions });
});

app.get('/api/transactions/:id', (req, res) => {
  const transaction = db.transactions.find(t => t.id === req.params.id);
  if (transaction) {
    res.json({ success: true, data: transaction });
  } else {
    res.status(404).json({ success: false, error: 'Transaction not found' });
  }
});

app.get('/api/transactions/pending', (req, res) => {
  const pending = db.transactions.filter(t => t.status === 'pending');
  res.json({ success: true, data: pending });
});

app.get('/api/transactions/credit', (req, res) => {
  const credit = db.transactions.filter(t => t.status === 'credit');
  res.json({ success: true, data: credit });
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ZORI Auto Spa API is running' });
});

app.listen(PORT, () => {
  console.log('🚀 Server running on http://localhost:' + PORT);
  console.log('📊 API endpoints available at http://localhost:' + PORT + '/api');
});
