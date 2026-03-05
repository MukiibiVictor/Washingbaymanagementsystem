// User & Authentication Types
export type UserRole = 'superadmin' | 'admin' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  last_login?: string;
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
export type PaymentMethod = 'cash' | 'mobile_money' | 'card' | 'credit';

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
