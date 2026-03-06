# Database Integration Guide

## Overview
The frontend has been successfully connected to the backend API, and all dummy data has been removed from both the frontend and backend.

## Changes Made

### 1. Backend Server (server/server.js)
- ✅ Removed all dummy check-ins data
- ✅ Removed all dummy transactions data  
- ✅ Removed all dummy payments data
- ✅ Kept only one default admin user for initial login
- ✅ Kept pricing rules for all vehicle and service type combinations
- ✅ Database now starts empty and clean

### 2. Frontend API Integration

#### Created New API Service (src/app/lib/api-service.ts)
- Real API client that connects to backend
- Replaces all mock API functions
- Maintains event system for real-time updates
- Handles authentication tokens
- Proper error handling

#### Updated Auth Context (src/app/lib/auth-context.tsx)
- Now uses real backend authentication
- Stores JWT tokens in localStorage
- Validates sessions on app load
- Removed mock user data

#### Updated All Pages
The following pages now use the real API:
- ✅ DashboardPage.tsx
- ✅ CheckInsPage.tsx
- ✅ TransactionsPage.tsx
- ✅ UsersPage.tsx
- ✅ UserProfilesPage.tsx
- ✅ ProfilePage.tsx
- ✅ PricingPage.tsx

### 3. Removed Mock Data
- Frontend mock-api.ts is no longer used
- All pages now fetch data from backend
- No dummy transactions, check-ins, or payments
- Clean slate for production use

## How to Use

### 1. Start the Backend Server
```bash
cd server
npm start
```
Server runs on: http://localhost:3001

### 2. Start the Frontend
```bash
npm run dev
```
Frontend runs on: http://localhost:5173

### 3. Login with Default Admin
```
Email: admin@zoriautospa.com
Password: admin123
```

## Data Flow

### Authentication
1. User enters credentials on login page
2. Frontend sends POST request to `/api/auth/login`
3. Backend validates credentials
4. Backend returns JWT token and user data
5. Frontend stores token in localStorage
6. Token is sent with all subsequent requests

### Check-ins
1. Admin uploads vehicle image or uses manual entry
2. Frontend sends POST to `/api/checkins`
3. Backend stores check-in with "pending" status
4. Admin confirms check-in with vehicle details
5. Frontend sends PUT to `/api/checkins/:id/confirm`
6. Backend creates transaction automatically
7. Real-time events update all pages

### Transactions
1. Backend creates transaction when check-in is confirmed
2. Frontend fetches transactions from `/api/transactions`
3. Admin processes payment
4. Frontend sends POST to `/api/transactions/:id/payment`
5. Backend updates transaction status
6. Real-time events refresh dashboard and transaction pages

### Real-Time Updates
- Event system still works with real API
- When data changes, events are emitted
- All subscribed pages refresh automatically
- No manual page refresh needed

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/profile` - Update user profile
- `DELETE /api/users/:id` - Delete user

### Check-ins
- `GET /api/checkins` - Get all check-ins
- `GET /api/checkins/pending` - Get pending check-ins
- `POST /api/checkins` - Create new check-in
- `PUT /api/checkins/:id/confirm` - Confirm check-in

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `GET /api/transactions/pending` - Get pending transactions
- `GET /api/transactions/credit` - Get credit transactions
- `POST /api/transactions/:id/payment` - Process payment

### Pricing
- `GET /api/pricing` - Get all pricing rules
- `PUT /api/pricing/:id` - Update pricing rule

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
VITE_USE_MOCK_API=false
```

### Backend (server/.env)
```
PORT=3001
NODE_ENV=development
JWT_SECRET=zori_autospa_secret_key_2024
```

## Database Status

### Current Setup
- Using in-memory storage (data resets on server restart)
- Suitable for development and testing
- Fast and simple

### Production Recommendations
1. **PostgreSQL Database**
   - Install PostgreSQL
   - Create database schema
   - Update server.js to use pg library
   - Store data persistently

2. **MongoDB**
   - Alternative NoSQL option
   - Good for flexible schema
   - Easy to scale

3. **MySQL/MariaDB**
   - Traditional relational database
   - Well-supported
   - Good performance

## Testing the Integration

### 1. Test Login
- Open http://localhost:5173
- Login with admin@zoriautospa.com / admin123
- Verify you're redirected to dashboard

### 2. Test Empty State
- Dashboard should show 0 revenue, 0 vehicles
- Check-ins page should show "No pending check-ins"
- Transactions page should show "No transactions found"

### 3. Test Manual Entry
- Go to Check-ins page
- Click "Manual Entry"
- Capture photo
- Enter vehicle details
- Submit
- Verify transaction appears on Dashboard and Transactions page

### 4. Test Payment Processing
- Go to Transactions page
- Click "Process Payment" on a transaction
- Select payment method
- Confirm
- Verify transaction status changes to "paid"
- Verify Dashboard updates automatically

### 5. Test User Management
- Go to Users page
- Create new user
- Verify user appears in list
- Update user role
- Delete user

## Troubleshooting

### Backend Not Starting
```bash
cd server
rm -rf node_modules
npm install
npm start
```

### Frontend Not Connecting
1. Check backend is running on port 3001
2. Check .env file has correct API URL
3. Clear browser cache and localStorage
4. Restart frontend dev server

### Authentication Issues
1. Clear localStorage in browser DevTools
2. Check JWT_SECRET in server/.env
3. Verify backend /api/auth/login endpoint works

### Data Not Updating
1. Check browser console for errors
2. Verify backend is running
3. Check network tab in DevTools
4. Ensure real-time events are firing

## Next Steps

### Immediate
- ✅ Backend connected
- ✅ Dummy data removed
- ✅ Real-time updates working
- ✅ Authentication working

### Short Term
1. Add image upload to server storage
2. Implement proper file handling
3. Add data validation
4. Add error logging

### Long Term
1. Migrate to PostgreSQL database
2. Add database migrations
3. Implement backup system
4. Add API rate limiting
5. Add comprehensive logging
6. Deploy to production

## Security Notes

### Current Setup (Development)
- Simple JWT tokens
- No token expiration
- No refresh tokens
- Passwords stored in plain text

### Production Requirements
- Hash passwords with bcrypt
- Implement token expiration
- Add refresh token mechanism
- Use HTTPS only
- Add rate limiting
- Implement CORS properly
- Add input validation
- Sanitize user inputs
- Add SQL injection protection (when using SQL database)

## Support

For issues or questions:
1. Check this documentation
2. Review backend logs in terminal
3. Check browser console for errors
4. Verify API endpoints with Postman/Thunder Client
5. Check network requests in browser DevTools
