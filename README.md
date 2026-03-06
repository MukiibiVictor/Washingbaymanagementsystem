
  # Washing Bay Management System

This is a code bundle for Washing Bay Management System. The original project is available at https://www.figma.com/design/fM1QuMBIdZFTA1BxTbLfbA/Washing-Bay-Management-System.

## Features

### Core Functionality
- 🚗 Vehicle check-in management with camera integration
- 💰 Transaction and payment processing (Cash, MTN Mobile Money, Airtel Money, Card, Credit)
- 📊 Real-time dashboard with revenue tracking
- 👥 User management with role-based access (SuperAdmin, Admin, Viewer)
- 💵 Financial tracking with expenses and reports
- 📈 Trend analysis with charts and graphs
- 🌓 Dark/Light mode with custom theme

### Manual Vehicle Entry
- 📸 Live camera capture for vehicle photos
- ✍️ Manual data entry when cameras are offline
- ✅ Immediate transaction creation
- 🔄 Real-time updates across all pages

### Real-Time Updates
- Dashboard automatically refreshes when transactions change
- Transactions page updates in real-time
- Check-ins page reflects new entries immediately
- No manual page refresh needed

## Quick Start

See **[QUICK_START.md](QUICK_START.md)** for a step-by-step guide to get started in 3 minutes!

## Running the Code

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
```bash
cd server
npm install
npm start
```
Backend runs on: http://localhost:3001

### Frontend Setup
```bash
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

### Important Notes
- Backend must be running before starting frontend
- Data is stored in-memory (resets on server restart)
- For production, migrate to PostgreSQL or MongoDB

## Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 3 minutes
- **[PERFORMANCE_IMPROVEMENTS.md](PERFORMANCE_IMPROVEMENTS.md)** - Latest performance fixes and payment flow
- **[DATABASE_INTEGRATION.md](DATABASE_INTEGRATION.md)** - Backend connection and API integration
- **[BACKEND_SETUP.md](BACKEND_SETUP.md)** - Backend API documentation
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Manual entry and real-time updates guide
- **[FINANCIAL_FEATURES.md](FINANCIAL_FEATURES.md)** - Financial tracking features
- **[THEME_GUIDE.md](THEME_GUIDE.md)** - Dark/Light mode customization
- **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** - Database migration details
- **[TASK_COMPLETION_SUMMARY.md](TASK_COMPLETION_SUMMARY.md)** - Implementation summary

## User Roles

- **SuperAdmin** - Full access to all features including user management
- **Admin** - Can manage check-ins, transactions, and payments
- **Viewer** - Read-only access to view data

## Default Login

```
Email: admin@zoriautospa.com
Password: admin123
```

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization
- Node.js + Express (backend)
- In-memory database (development)
  