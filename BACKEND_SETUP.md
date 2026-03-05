# Backend Integration Guide

## Overview
This guide will help you set up the backend API for the ZORI Auto Spa Management System.

## Backend Structure

```
server/
├── package.json
├── .env
├── server.js
├── config/
│   └── database.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── checkins.js
│   ├── transactions.js
│   ├── pricing.js
│   └── dashboard.js
├── controllers/
│   ├── authController.js
│   ├── usersController.js
│   ├── checkinsController.js
│   ├── transactionsController.js
│   ├── pricingController.js
│   └── dashboardController.js
└── uploads/
```

## Installation Steps

### 1. Create Backend Directory
```bash
mkdir server
cd server
```

### 2. Initialize Node.js Project
```bash
npm init -y
```

### 3. Install Dependencies
```bash
npm install express cors dotenv bcryptjs jsonwebtoken multer pg
```

### 4. Create Database Schema

```sql
-- Create database
CREATE DATABASE zori_autospa;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('superadmin', 'admin', 'viewer')),
    profile_picture TEXT,
    contact VARCHAR(50),
    id_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Check-ins table
CREATE TABLE checkins (
    id SERIAL PRIMARY KEY,
    camera_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
    plate_number VARCHAR(50),
    vehicle_type VARCHAR(50),
    service_type VARCHAR(100),
    confirmed_by INTEGER REFERENCES users(id),
    confirmed_at TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    checkin_id INTEGER REFERENCES checkins(id),
    vehicle_type VARCHAR(50) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    plate_number VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'credit')),
    admin_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url TEXT
);

-- Payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id),
    method VARCHAR(50) NOT NULL CHECK (method IN ('cash', 'mobile_money', 'card', 'credit')),
    amount INTEGER NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pricing rules table
CREATE TABLE pricing_rules (
    id SERIAL PRIMARY KEY,
    vehicle_type VARCHAR(50) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    minimum_price INTEGER NOT NULL,
    updated_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vehicle_type, service_type)
);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, name, role) VALUES 
('admin@zoriautospa.com', '$2a$10$YourHashedPasswordHere', 'John Admin', 'superadmin');

-- Insert default pricing rules
INSERT INTO pricing_rules (vehicle_type, service_type, minimum_price, updated_by) VALUES
('Sedan', 'Wash', 10000, 1),
('Sedan', 'Wash & Wax', 15000, 1),
('SUV', 'Wash', 12000, 1),
('SUV', 'Wash & Wax', 18000, 1),
('Lorry', 'Wash', 20000, 1),
('Fuso', 'Wash', 25000, 1);
```

### 5. Environment Variables

Create `.env` file:
```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=zori_autospa
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key_change_this_in_production

UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (superadmin only)
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/profile` - Update user profile
- `DELETE /api/users/:id` - Delete user

### Check-ins
- `GET /api/checkins` - Get all check-ins
- `GET /api/checkins/pending` - Get pending check-ins
- `POST /api/checkins` - Create check-in (camera upload)
- `PUT /api/checkins/:id/confirm` - Confirm check-in

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `GET /api/transactions/pending` - Get pending transactions
- `GET /api/transactions/credit` - Get credit transactions
- `POST /api/transactions/:id/payment` - Record payment

### Pricing
- `GET /api/pricing` - Get all pricing rules
- `PUT /api/pricing/:id` - Update pricing rule

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Running the Backend

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Frontend Configuration

Update `src/app/lib/api.ts` to point to your backend:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

Add to `.env` in frontend:
```env
VITE_API_URL=http://localhost:3001/api
```

## Security Considerations

1. **JWT Authentication**: All protected routes require JWT token
2. **Password Hashing**: Use bcrypt with salt rounds >= 10
3. **Input Validation**: Validate all inputs on backend
4. **File Upload**: Limit file size and validate file types
5. **CORS**: Configure CORS properly for production
6. **Environment Variables**: Never commit `.env` files
7. **SQL Injection**: Use parameterized queries
8. **Rate Limiting**: Implement rate limiting for API endpoints

## Deployment

### Using Railway/Render/Heroku
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Using VPS (Ubuntu)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Clone and setup
git clone your-repo
cd server
npm install
npm start
```

## Testing

Use tools like Postman or Thunder Client to test API endpoints.

Example login request:
```json
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "admin@zoriautospa.com",
  "password": "admin123"
}
```
