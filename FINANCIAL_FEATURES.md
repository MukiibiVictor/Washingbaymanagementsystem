# Financial Features Guide

## Overview
The ZORI Auto Spa Management System now includes comprehensive financial tracking with all values starting at 0 until users record actual data.

## Features Implemented

### 1. Expenses Tracking (`/expenses`)
**Purpose**: Record and track daily business expenses

**Features**:
- Add expenses with category, description, amount, and date
- Categories: Supplies, Utilities, Salaries, Maintenance, Equipment, Marketing, Other
- View today's expenses and total expenses
- Delete incorrect entries
- Color-coded category badges
- Empty state when no expenses recorded

**How to Use**:
1. Click "Add Expense" button
2. Select category
3. Enter description (e.g., "Car wash soap")
4. Enter amount in UGX
5. Select date
6. Click "Add Expense"

**Initial State**: 0 UGX (no expenses until you add them)

---

### 2. Financial Reports (`/reports`)
**Purpose**: View revenue, expense trends, and download reports

**Features**:
- Revenue & Expenses trend chart (line graph)
- Expenses by category chart (bar graph)
- Summary cards: Total Revenue, Total Expenses, Net Income
- Period selection: Daily, Weekly, Monthly
- Month selector
- Download reports as CSV
- Empty states with helpful messages

**How to Use**:
1. Select report period (Daily/Weekly/Monthly)
2. Choose month
3. View charts and summaries
4. Click "Download Report" to export CSV

**Initial State**: All values at 0 UGX, charts show empty state messages

---

### 3. Mobile Money Payments (`/transactions`)
**Purpose**: Process payments via MTN, Airtel, Cash, Card, or Credit

**Payment Methods**:
- 💵 **Cash**: Immediate recording
- 📱 **MTN Mobile Money**: Requires phone number
- 📱 **Airtel Money**: Requires phone number
- 💳 **Card**: Card payment
- 📝 **On Credit**: Mark as credit for later collection

**How to Use**:
1. Go to Transactions page
2. Click "Process Payment" on pending transaction
3. Select payment method
4. If mobile money: Enter phone number (e.g., 0700123456)
5. Click "Process Payment"

**Phone Number Format**: 0700123456 or 0750123456

---

## Data Flow

### Revenue Recording:
1. Camera captures vehicle → Check-in created
2. Admin confirms check-in → Transaction created (status: pending)
3. Admin processes payment → Transaction marked as paid
4. Revenue is recorded with payment method

### Expense Recording:
1. Admin adds expense with category and amount
2. Expense is recorded with date and creator
3. Expense appears in Expenses page
4. Expense data feeds into Reports

### Report Generation:
1. System aggregates all paid transactions (Revenue)
2. System aggregates all expenses (Expenses)
3. Calculates: Net Income = Revenue - Expenses
4. Generates trend data by day/week/month
5. Groups expenses by category

---

## Empty States

All pages start with empty states showing 0 values:

### Expenses Page:
- Today's Expenses: UGX 0
- Total Expenses: UGX 0
- Message: "No expenses recorded"

### Reports Page:
- Total Revenue: UGX 0
- Total Expenses: UGX 0
- Net Income: UGX 0
- Charts: "No data available" message
- Percentage changes: "No data yet"

### Dashboard:
- Shows actual transaction data
- If no transactions: Shows 0 values

---

## CSV Report Format

Downloaded reports include:
```csv
Date,Revenue,Expenses,Net Income
2024-03-05,450000,120000,330000
2024-03-06,520000,95000,425000
```

---

## User Roles & Permissions

### SuperAdmin:
- ✅ Add/view expenses
- ✅ View all reports
- ✅ Process payments
- ✅ Download reports

### Admin:
- ✅ Add/view expenses
- ✅ View all reports
- ✅ Process payments
- ✅ Download reports

### Viewer:
- ✅ View reports (read-only)
- ❌ Cannot add expenses
- ❌ Cannot process payments

---

## Navigation

New menu items:
- **Expenses** (💵 icon) - Track business costs
- **Reports** (📈 icon) - View trends and analytics

---

## Next Steps

To populate data:
1. **Record Transactions**: Process check-ins and payments
2. **Add Expenses**: Record daily business costs
3. **View Reports**: See trends and download reports

All financial data starts at 0 and grows as you use the system!
