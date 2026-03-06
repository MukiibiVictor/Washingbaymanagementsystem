# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start the Backend
```bash
cd server
npm install
npm start
```
✅ Backend running on http://localhost:3001

### Step 2: Start the Frontend
```bash
# In a new terminal, from project root
npm install
npm run dev
```
✅ Frontend running on http://localhost:5173

### Step 3: Login
Open http://localhost:5173 in your browser

**Default Admin Credentials:**
- Email: `admin@zoriautospa.com`
- Password: `admin123`

---

## 📊 What You'll See

### Dashboard (Empty State)
- Revenue: UGX 0
- Vehicles Today: 0
- Outstanding Credit: UGX 0
- No transactions yet

### Check-ins Page
- "No pending check-ins" message
- "Manual Entry" button to add vehicles
- "Simulate Camera" button for testing

### Transactions Page
- "No transactions found" message
- Will populate when you create check-ins

---

## 🎯 Try These Features

### 1. Manual Vehicle Entry
1. Go to **Check-ins** page
2. Click **"Manual Entry"** button
3. Allow camera access
4. Capture photo of vehicle
5. Fill in details:
   - Plate Number (e.g., UBR123A)
   - Vehicle Type (Sedan, SUV, Lorry, Fuso)
   - Service Type (Wash, Wash & Wax, etc.)
   - Price (must meet minimum)
6. Click **"Record Vehicle"**
7. ✅ Transaction created!

### 2. View Dashboard Updates
1. After creating a transaction
2. Go to **Dashboard**
3. See updated revenue and vehicle count
4. View transaction in recent transactions list

### 3. Process Payment
1. Go to **Transactions** page
2. Find your transaction
3. Click **"Process Payment"**
4. Select payment method:
   - Cash
   - MTN Mobile Money (requires phone number)
   - Airtel Money (requires phone number)
   - Card
   - Credit (on account)
5. Click **"Confirm"**
6. ✅ Payment recorded!

### 4. Manage Users
1. Go to **Users** page
2. Click **"Add User"**
3. Fill in details:
   - Name
   - Email
   - Password
   - Role (SuperAdmin, Admin, Viewer)
4. Click **"Create User"**
5. ✅ New user added!

### 5. Update Pricing
1. Go to **Pricing** page
2. Find a vehicle/service combination
3. Click **"Edit"**
4. Enter new minimum price
5. Click **"Update"**
6. ✅ Pricing updated!

---

## 🔄 Real-Time Updates

The system automatically updates all pages when data changes:

- Create a transaction → Dashboard updates
- Process payment → Transactions page updates
- Add check-in → Check-ins page updates

**No manual refresh needed!**

---

## 👥 User Roles

### SuperAdmin
- Full access to everything
- Can manage users
- Can delete users
- Can update pricing

### Admin
- Can manage check-ins
- Can process transactions
- Can process payments
- Cannot manage users

### Viewer
- Read-only access
- Can view all data
- Cannot make changes

---

## 📱 Mobile Money Payments

### MTN Mobile Money
1. Select "MTN Mobile Money" as payment method
2. Enter customer's MTN phone number
3. Format: 0700123456 or 0780123456
4. Click "Confirm"

### Airtel Money
1. Select "Airtel Money" as payment method
2. Enter customer's Airtel phone number
3. Format: 0750123456 or 0790123456
4. Click "Confirm"

---

## 🌓 Dark/Light Mode

Toggle between dark and light themes:
1. Look for Sun/Moon icon in header
2. Click to switch themes
3. Preference saved automatically

---

## 🎨 Theme Colors

### Light Mode
- Clean white backgrounds
- Blue accents
- Easy on the eyes

### Dark Mode
- Deep Navy (#0a1628)
- Dark Blue (#0d1b2e)
- Midnight Blue (#0f1f3a)
- Smoke Grey (#374151)

---

## 📊 Reports & Analytics

### View Financial Reports
1. Go to **Reports** page
2. Select period (Daily, Weekly, Monthly)
3. View trend charts
4. Download CSV reports

### Track Expenses
1. Go to **Expenses** page
2. Click **"Add Expense"**
3. Fill in details:
   - Category
   - Description
   - Amount
   - Date
4. Click **"Add Expense"**
5. View expense summary

---

## 🔧 Troubleshooting

### Backend Won't Start
```bash
cd server
rm -rf node_modules
npm install
npm start
```

### Frontend Won't Start
```bash
rm -rf node_modules
npm install
npm run dev
```

### Can't Login
1. Check backend is running (http://localhost:3001)
2. Use correct credentials:
   - Email: admin@zoriautospa.com
   - Password: admin123
3. Clear browser cache
4. Try incognito/private window

### Camera Not Working
1. Grant camera permissions in browser
2. Use HTTPS in production
3. Check browser console for errors
4. Try different browser

### Data Not Showing
1. Ensure backend is running
2. Check browser console for errors
3. Verify network requests in DevTools
4. Create some test data first

---

## 💡 Tips

### For Best Experience
- Use Chrome, Firefox, or Edge
- Allow camera permissions
- Keep backend running
- Don't refresh during operations

### Data Persistence
- Data stored in-memory
- Resets when server restarts
- For production, use PostgreSQL

### Testing
- Create test transactions
- Try different payment methods
- Test with different user roles
- Explore all features

---

## 📚 More Documentation

- **[DATABASE_INTEGRATION.md](DATABASE_INTEGRATION.md)** - API integration details
- **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** - What changed
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Manual entry guide
- **[FINANCIAL_FEATURES.md](FINANCIAL_FEATURES.md)** - Financial tracking
- **[THEME_GUIDE.md](THEME_GUIDE.md)** - Theme customization

---

## 🎉 You're Ready!

Start creating transactions and exploring the system. Everything you do will be reflected in real-time across all pages.

**Happy washing! 🚗💦**
