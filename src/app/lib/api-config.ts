export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  UPDATE_PROFILE: (id: string) => `/users/${id}/profile`,
  
  // Check-ins
  CHECKINS: '/checkins',
  CHECKINS_PENDING: '/checkins/pending',
  CONFIRM_CHECKIN: (id: string) => `/checkins/${id}/confirm`,
  
  // Transactions
  TRANSACTIONS: '/transactions',
  TRANSACTION_BY_ID: (id: string) => `/transactions/${id}`,
  TRANSACTIONS_PENDING: '/transactions/pending',
  TRANSACTIONS_CREDIT: '/transactions/credit',
  RECORD_PAYMENT: (id: string) => `/transactions/${id}/payment`,
  
  // Pricing
  PRICING: '/pricing',
  UPDATE_PRICING: (id: string) => `/pricing/${id}`,
  
  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
};
