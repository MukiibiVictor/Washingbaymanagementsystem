// User & Authentication Types
export type UserRole = 'superadmin' | 'admin' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  last_login?: string;
  profile_picture?: string;
  contact?: string;
  id_number?: string;
}

// Camera & Check-in Types
export interface Camera {
  id: number;
  name: string;
  location: string;
  is_active: boolean;
}

export type CheckInStatus = 'pending' | 'confirmed' | 'rejected';

export interface CheckIn {
  id: string;
  camera_id: number;
  image_url: string;
  timestamp: string;
  status: CheckInStatus;
  plate_number?: string;
  vehicle_type?: VehicleType;
  service_type?: ServiceType;
  confirmed_by?: string;
  confirmed_at?: string;
}

// Vehicle & Service Types
export type VehicleType = 'Sedan' | 'SUV' | 'Lorry' | 'Fuso';
export type ServiceType = 'Wash' | 'Wash & Wax' | 'Full Detail' | 'Interior Only';

// Pricing Rules
export interface PricingRule {
  id: string;
  vehicle_type: VehicleType;
  service_type: ServiceType;
  minimum_price: number;
  updated_at: string;
  updated_by: string;
}

// Transaction Types
export type TransactionStatus = 'pending' | 'paid' | 'credit';
export type PaymentMethod = 'cash' | 'mtn_mobile_money' | 'airtel_mobile_money' | 'card' | 'credit';

export interface Transaction {
  id: string;
  checkin_id: string;
  vehicle_type: VehicleType;
  service_type: ServiceType;
  plate_number: string;
  price: number;
  status: TransactionStatus;
  admin_id: string;
  admin_name: string;
  created_at: string;
  image_url?: string;
}

export interface Payment {
  id: string;
  transaction_id: string;
  method: PaymentMethod;
  amount: number;
  created_at: string;
  created_by: string;
  phone_number?: string; // For mobile money
  reference_number?: string; // Transaction reference
}

// Expense Types
export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  created_by: string;
  created_at: string;
  receipt_url?: string;
}

export type ExpenseCategory = 
  | 'supplies' 
  | 'utilities' 
  | 'salaries' 
  | 'maintenance' 
  | 'equipment' 
  | 'marketing' 
  | 'other';

// Financial Reports
export interface DailyReport {
  date: string;
  revenue: number;
  expenses: number;
  net_income: number;
  transactions_count: number;
  expenses_count: number;
}

export interface WeeklyReport {
  week_start: string;
  week_end: string;
  revenue: number;
  expenses: number;
  net_income: number;
  daily_breakdown: DailyReport[];
}

export interface MonthlyReport {
  month: string;
  year: number;
  revenue: number;
  expenses: number;
  net_income: number;
  weekly_breakdown: WeeklyReport[];
  expense_by_category: { category: ExpenseCategory; amount: number }[];
}

export interface TrendData {
  date: string;
  revenue: number;
  expenses: number;
  net_income: number;
}

// Dashboard Stats
export interface DashboardStats {
  today_revenue: number;
  vehicles_today: number;
  outstanding_credit: number;
  revenue_by_vehicle: { vehicle_type: VehicleType; revenue: number }[];
  revenue_by_service: { service_type: ServiceType; revenue: number }[];
  recent_transactions: Transaction[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
