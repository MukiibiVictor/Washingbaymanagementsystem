# Troubleshooting Guide

## Issue: Transactions Fail to Load from Check-ins

### Problem Fixed
The backend API routes were in the wrong order, causing `/api/transactions/pending` and `/api/transactions/credit` to be matched as `/api/transactions/:id` with id="pending" or id="credit".

### Solution Applied
1. Reordered routes so specific routes come before parameterized routes
2. Added request logging to help debug future issues
3. Restarted backend server

### Route Order (Fixed)
```javascript
// ✅ CORRECT ORDER
app.get('/api/transactions')           // List all
app.get('/api/transactions/pending')   // Specific route
app.get('/api/transactions/credit')    // Specific route  
app.get('/api/transactions/:id')       // Parameterized route (LAST)
```

```javascript
// ❌ WRONG ORDER (was causing the issue)
app.get('/api/transactions')           // List all
app.get('/api/transactions/:id')       // This catches "pending" and "credit"!
app.get('/api/transactions/pending')   // Never reached
app.get('/api/transactions/credit')    // Never reached
```

## Current Status
✅ Backend server running on http://localhost:3001  
✅ Routes fixed and in correct order  
✅ Request logging enabled  
✅ Ready to test

## How to Test

### Test 1: Check Transactions Load
1. Open browser to http://localhost:5173
2. Login with admin@zoriautospa.com / admin123
3. Go to Transactions page
4. Should see "No transactions found" (not stuck on loading)

### Test 2: Create Transaction via Manual Entry
1. Go to Check-ins page
2. Click "Manual Entry"
3. Capture photo
4. Enter details:
   - Plate: UBR123A
   - Vehicle: Sedan
   - Service: Wash
   - Price: 10000
   - Payment: Cash
5. Submit
6. ✅ Should see success message
7. ✅ Go to Transactions - should see the transaction
8. ✅ Go to Dashboard - should see revenue

### Test 3: Check Reports
1. Go to Reports page
2. Should load without errors
3. If no data, will show "No data available"
4. Create transactions to see data

## Common Issues & Solutions

### Issue: "Failed to load transactions"
**Cause:** Backend not running  
**Solution:**
```bash
cd server
npm start
```

### Issue: Stuck on "Loading..."
**Cause:** API call failing  
**Solution:**
1. Check backend is running
2. Check browser console for errors
3. Click "Retry Connection" button

### Issue: Transactions not appearing
**Cause:** No transactions created yet  
**Solution:**
1. Create a transaction via Manual Entry
2. Refresh the page
3. Check Dashboard for confirmation

### Issue: Port 3001 already in use
**Cause:** Previous server instance still running  
**Solution:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Then restart
cd server
npm start
```

### Issue: Reports show no data
**Cause:** No transactions or expenses recorded  
**Solution:**
1. Create transactions via Manual Entry
2. Add expenses on Expenses page
3. Data will appear in reports

## Backend Logs

The backend now logs all requests:
```
2026-03-06T10:30:45.123Z - GET /api/transactions
2026-03-06T10:30:45.456Z - GET /api/transactions/pending
2026-03-06T10:30:45.789Z - GET /api/transactions/credit
```

Check the backend terminal to see these logs and debug issues.

## API Endpoints (Correct Order)

### Authentication
- POST `/api/auth/login`
- GET `/api/auth/me`

### Users
- GET `/api/users`
- GET `/api/users/:id`
- POST `/api/users`
- PUT `/api/users/:id`
- PUT `/api/users/:id/profile`
- DELETE `/api/users/:id`

### Check-ins
- GET `/api/checkins`
- GET `/api/checkins/pending`
- POST `/api/checkins`
- PUT `/api/checkins/:id/confirm`

### Transactions (FIXED ORDER)
- GET `/api/transactions` - Get all
- GET `/api/transactions/pending` - Get pending (specific)
- GET `/api/transactions/credit` - Get credit (specific)
- GET `/api/transactions/:id` - Get by ID (parameterized)
- POST `/api/transactions/:id/payment` - Process payment

### Pricing
- GET `/api/pricing`
- PUT `/api/pricing/:id`

### Dashboard
- GET `/api/dashboard/stats`

## Testing API Endpoints

You can test endpoints directly:

### Test Transactions Endpoint
```bash
# Get all transactions
curl http://localhost:3001/api/transactions

# Get pending transactions
curl http://localhost:3001/api/transactions/pending

# Get credit transactions
curl http://localhost:3001/api/transactions/credit
```

### Expected Response
```json
{
  "success": true,
  "data": []
}
```

## Debugging Steps

### 1. Check Backend is Running
```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "ZORI Auto Spa API is running"
}
```

### 2. Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors (red text)
4. Check Network tab for failed requests

### 3. Check Backend Terminal
Look for:
- Request logs
- Error messages
- Stack traces

### 4. Test API Directly
Use browser or curl to test endpoints:
```
http://localhost:3001/api/transactions
http://localhost:3001/api/transactions/pending
http://localhost:3001/api/dashboard/stats
```

## Quick Fixes

### Restart Everything
```bash
# Stop backend (Ctrl+C in terminal)
# Then:
cd server
npm start

# In another terminal:
npm run dev
```

### Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Check .env File
Frontend `.env`:
```
VITE_API_URL=http://localhost:3001/api
VITE_USE_MOCK_API=false
```

Backend `server/.env`:
```
PORT=3001
NODE_ENV=development
```

## Success Indicators

✅ Backend shows: "🚀 Server running on http://localhost:3001"  
✅ Frontend loads without errors  
✅ Login works  
✅ Dashboard shows stats (even if 0)  
✅ Transactions page loads (even if empty)  
✅ Can create transactions via Manual Entry  
✅ Transactions appear on Dashboard  
✅ Reports page loads  

## Still Having Issues?

1. **Check both terminals** - backend and frontend
2. **Look for error messages** in red
3. **Check browser console** (F12)
4. **Verify ports**:
   - Backend: 3001
   - Frontend: 5173
5. **Restart both servers**
6. **Clear browser cache**
7. **Check the backend logs** for request patterns

## Contact Information

If issues persist:
1. Check ERROR_HANDLING_FIX.md
2. Check PERFORMANCE_IMPROVEMENTS.md
3. Check DATABASE_INTEGRATION.md
4. Review backend terminal logs
5. Review browser console errors

## Summary

The main issue was route ordering in the backend. This has been fixed. The backend now:
- Has routes in correct order
- Logs all requests
- Handles errors properly
- Returns proper JSON responses

The frontend now:
- Has error handling
- Shows helpful error messages
- Has retry buttons
- Provides clear feedback

Everything should work now! Test by creating a transaction via Manual Entry and checking it appears on the Transactions page and Dashboard.
