import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'database.json');

// Default database structure
const defaultDb = {
  users: [
    { 
      id: '1', 
      email: 'admin@zoriautospa.com', 
      password: 'admin123', 
      name: 'Admin User', 
      role: 'superadmin', 
      created_at: new Date().toISOString() 
    }
  ],
  checkins: [],
  transactions: [],
  payments: [],
  expenses: [],
  services: [
    {
      id: 'srv-1',
      title: 'Basic Wash',
      description: 'Quick and efficient exterior wash to keep your vehicle looking fresh.',
      features: ['Exterior hand wash', 'Tire cleaning', 'Window cleaning', 'Quick dry'],
      price_range: '10,000 - 25,000 UGX',
      duration: '30-45 minutes',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-2',
      title: 'Wash & Wax',
      description: 'Complete wash with protective wax coating for lasting shine and protection.',
      features: ['Full exterior wash', 'Premium wax application', 'Tire shine', 'Window treatment', 'Interior vacuum'],
      price_range: '15,000 - 35,000 UGX',
      duration: '1-1.5 hours',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-3',
      title: 'Full Detail',
      description: 'Comprehensive detailing service for both interior and exterior perfection.',
      features: ['Deep exterior wash & wax', 'Interior deep cleaning', 'Leather conditioning', 'Engine bay cleaning', 'Headlight restoration', 'Odor elimination'],
      price_range: '25,000 - 50,000 UGX',
      duration: '2-3 hours',
      created_at: new Date().toISOString()
    }
  ],
  footer: {
    id: 'footer-1',
    company_name: 'ZORI auto spa',
    tagline: 'flawless shine, water with luxury',
    email: 'mukiibijohnvictor@gmail.com',
    phone: '+256751768901',
    address: 'Kampala, Uganda',
    description: 'Professional auto spa services delivering exceptional vehicle care with premium products and expert technicians.',
    social_links: {},
    updated_at: new Date().toISOString()
  },
  pricingRules: [
    { id: '1', vehicle_type: 'Sedan', service_type: 'Wash', minimum_price: 10000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '2', vehicle_type: 'Sedan', service_type: 'Wash & Wax', minimum_price: 15000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '3', vehicle_type: 'Sedan', service_type: 'Full Detail', minimum_price: 25000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '4', vehicle_type: 'Sedan', service_type: 'Interior Only', minimum_price: 8000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '5', vehicle_type: 'SUV', service_type: 'Wash', minimum_price: 12000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '6', vehicle_type: 'SUV', service_type: 'Wash & Wax', minimum_price: 18000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '7', vehicle_type: 'SUV', service_type: 'Full Detail', minimum_price: 30000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '8', vehicle_type: 'SUV', service_type: 'Interior Only', minimum_price: 10000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '9', vehicle_type: 'Lorry', service_type: 'Wash', minimum_price: 20000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '10', vehicle_type: 'Lorry', service_type: 'Wash & Wax', minimum_price: 28000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '11', vehicle_type: 'Lorry', service_type: 'Full Detail', minimum_price: 40000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '12', vehicle_type: 'Lorry', service_type: 'Interior Only', minimum_price: 15000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '13', vehicle_type: 'Fuso', service_type: 'Wash', minimum_price: 25000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '14', vehicle_type: 'Fuso', service_type: 'Wash & Wax', minimum_price: 35000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '15', vehicle_type: 'Fuso', service_type: 'Full Detail', minimum_price: 50000, updated_by: '1', updated_at: new Date().toISOString() },
    { id: '16', vehicle_type: 'Fuso', service_type: 'Interior Only', minimum_price: 18000, updated_by: '1', updated_at: new Date().toISOString() }
  ]
};

// Load database from file or create new one
export function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      const db = JSON.parse(data);
      console.log('✅ Database loaded from file');
      return db;
    } else {
      console.log('📝 Creating new database file');
      saveDatabase(defaultDb);
      return defaultDb;
    }
  } catch (error) {
    console.error('❌ Error loading database:', error);
    return defaultDb;
  }
}

// Save database to file
export function saveDatabase(db) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
    console.log('💾 Database saved to file');
  } catch (error) {
    console.error('❌ Error saving database:', error);
  }
}

// Auto-save wrapper - saves after every modification
export function createAutoSaveDb(db) {
  return new Proxy(db, {
    set(target, property, value) {
      target[property] = value;
      saveDatabase(target);
      return true;
    }
  });
}
