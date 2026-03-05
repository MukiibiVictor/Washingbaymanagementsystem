import {
  CheckIn,
  Transaction,
  Payment,
  PricingRule,
  DashboardStats,
  VehicleType,
  ServiceType,
  PaymentMethod,
  User,
} from './types';
import { dataEvents, DATA_EVENTS } from './events';

// Mock data storage
let mockCheckIns: CheckIn[] = [
  {
    id: 'ci-001',
    camera_id: 1,
    image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'pending',
  },
  {
    id: 'ci-002',
    camera_id: 1,
    image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    status: 'pending',
  },
  {
    id: 'ci-003',
    camera_id: 1,
    image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    status: 'pending',
  },
];

let mockTransactions: Transaction[] = [
  {
    id: 'tx-001',
    checkin_id: 'ci-100',
    vehicle_type: 'SUV',
    service_type: 'Wash',
    plate_number: 'UBR123A',
    price: 15000,
    status: 'paid',
    admin_id: '1',
    admin_name: 'John Admin',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b',
  },
  {
    id: 'tx-002',
    checkin_id: 'ci-101',
    vehicle_type: 'Sedan',
    service_type: 'Wash & Wax',
    plate_number: 'UAH456B',
    price: 18000,
    status: 'paid',
    admin_id: '2',
    admin_name: 'Mary Staff',
    created_at: new Date(Date.now() - 5400000).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
  },
  {
    id: 'tx-003',
    checkin_id: 'ci-102',
    vehicle_type: 'Lorry',
    service_type: 'Wash',
    plate_number: 'UBE789C',
    price: 25000,
    status: 'credit',
    admin_id: '1',
    admin_name: 'John Admin',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7',
  },
];

let mockPayments: Payment[] = [
  {
    id: 'pay-001',
    transaction_id: 'tx-001',
    method: 'cash',
    amount: 15000,
    created_at: new Date(Date.now() - 7000000).toISOString(),
    created_by: 'John Admin',
  },
  {
    id: 'pay-002',
    transaction_id: 'tx-002',
    method: 'mobile_money',
    amount: 18000,
    created_at: new Date(Date.now() - 5200000).toISOString(),
    created_by: 'Mary Staff',
  },
];

let mockPricingRules: PricingRule[] = [
  {
    id: 'pr-001',
    vehicle_type: 'Sedan',
    service_type: 'Wash',
    minimum_price: 10000,
    updated_at: '2024-01-01T00:00:00Z',
    updated_by: 'John Admin',
  },
  {
    id: 'pr-002',
    vehicle_type: 'Sedan',
    service_type: 'Wash & Wax',
    minimum_price: 15000,
    updated_at: '2024-01-01T00:00:00Z',
    updated_by: 'John Admin',
  },
  {
    id: 'pr-003',
    vehicle_type: 'SUV',
    service_type: 'Wash',
    minimum_price: 12000,
    updated_at: '2024-01-01T00:00:00Z',
    updated_by: 'John Admin',
  },
  {
    id: 'pr-004',
    vehicle_type: 'SUV',
    service_type: 'Wash & Wax',
    minimum_price: 18000,
    updated_at: '2024-01-01T00:00:00Z',
    updated_by: 'John Admin',
  },
  {
    id: 'pr-005',
    vehicle_type: 'Lorry',
    service_type: 'Wash',
    minimum_price: 20000,
    updated_at: '2024-01-01T00:00:00Z',
    updated_by: 'John Admin',
  },
  {
    id: 'pr-006',
    vehicle_type: 'Fuso',
    service_type: 'Wash',
    minimum_price: 25000,
    updated_at: '2024-01-01T00:00:00Z',
    updated_by: 'John Admin',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Check-ins API
export const checkInsApi = {
  getAll: async (): Promise<CheckIn[]> => {
    await delay(300);
    return mockCheckIns;
  },

  getPending: async (): Promise<CheckIn[]> => {
    await delay(300);
    return mockCheckIns.filter((c) => c.status === 'pending');
  },

  confirm: async (
    id: string,
    data: {
      service_type: ServiceType;
      vehicle_type: VehicleType;
      price: number;
      plate_number: string;
    },
    adminName: string
  ): Promise<{ success: boolean; error?: string; transaction?: Transaction }> => {
    await delay(500);

    // Find pricing rule
    const rule = mockPricingRules.find(
      (r) => r.vehicle_type === data.vehicle_type && r.service_type === data.service_type
    );

    if (rule && data.price < rule.minimum_price) {
      return {
        success: false,
        error: `Price must be at least ${rule.minimum_price.toLocaleString()} UGX for ${data.vehicle_type} - ${data.service_type}`,
      };
    }

    // Update check-in
    const checkInIndex = mockCheckIns.findIndex((c) => c.id === id);
    if (checkInIndex !== -1) {
      mockCheckIns[checkInIndex] = {
        ...mockCheckIns[checkInIndex],
        status: 'confirmed',
        plate_number: data.plate_number,
        vehicle_type: data.vehicle_type,
        service_type: data.service_type,
        confirmed_at: new Date().toISOString(),
      };

      // Create transaction
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        checkin_id: id,
        vehicle_type: data.vehicle_type,
        service_type: data.service_type,
        plate_number: data.plate_number,
        price: data.price,
        status: 'pending',
        admin_id: '1',
        admin_name: adminName,
        created_at: new Date().toISOString(),
        image_url: mockCheckIns[checkInIndex].image_url,
      };

      mockTransactions.unshift(newTransaction);

      // Emit events for real-time updates
      dataEvents.emit(DATA_EVENTS.CHECKIN_CONFIRMED);
      dataEvents.emit(DATA_EVENTS.TRANSACTION_CREATED);

      return { success: true, transaction: newTransaction };
    }

    return { success: false, error: 'Check-in not found' };
  },

  upload: async (cameraId: number, imageFile: File | string): Promise<CheckIn> => {
    await delay(1000);
    
    // Handle both File objects and base64 strings
    const imageUrl = typeof imageFile === 'string' 
      ? imageFile // base64 string from camera
      : URL.createObjectURL(imageFile); // File object from upload
    
    const newCheckIn: CheckIn = {
      id: `ci-${Date.now()}`,
      camera_id: cameraId,
      image_url: imageUrl,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    mockCheckIns.unshift(newCheckIn);
    
    // Emit event for real-time updates
    dataEvents.emit(DATA_EVENTS.CHECKIN_CREATED);
    
    return newCheckIn;
  },
};

// Transactions API
export const transactionsApi = {
  getAll: async (): Promise<Transaction[]> => {
    await delay(300);
    return mockTransactions;
  },

  getById: async (id: string): Promise<Transaction | null> => {
    await delay(200);
    return mockTransactions.find((t) => t.id === id) || null;
  },

  getPending: async (): Promise<Transaction[]> => {
    await delay(300);
    return mockTransactions.filter((t) => t.status === 'pending');
  },

  getCredit: async (): Promise<Transaction[]> => {
    await delay(300);
    return mockTransactions.filter((t) => t.status === 'credit');
  },
};

// Payments API
export const paymentsApi = {
  create: async (
    transactionId: string,
    method: PaymentMethod,
    amount: number,
    createdBy: string
  ): Promise<{ success: boolean; payment?: Payment }> => {
    await delay(500);

    const transaction = mockTransactions.find((t) => t.id === transactionId);
    if (!transaction) {
      return { success: false };
    }

    // Update transaction status
    const txIndex = mockTransactions.findIndex((t) => t.id === transactionId);
    if (method === 'credit') {
      mockTransactions[txIndex].status = 'credit';
    } else {
      mockTransactions[txIndex].status = 'paid';
    }

    // Create payment record
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      transaction_id: transactionId,
      method,
      amount,
      created_at: new Date().toISOString(),
      created_by: createdBy,
    };

    mockPayments.push(newPayment);

    // Emit events for real-time updates
    dataEvents.emit(DATA_EVENTS.PAYMENT_CREATED);
    dataEvents.emit(DATA_EVENTS.TRANSACTION_UPDATED);

    return { success: true, payment: newPayment };
  },

  getAll: async (): Promise<Payment[]> => {
    await delay(300);
    return mockPayments;
  },
};

// Pricing Rules API
export const pricingRulesApi = {
  getAll: async (): Promise<PricingRule[]> => {
    await delay(300);
    return mockPricingRules;
  },

  update: async (
    id: string,
    minimumPrice: number,
    updatedBy: string
  ): Promise<{ success: boolean }> => {
    await delay(400);
    const index = mockPricingRules.findIndex((r) => r.id === id);
    if (index !== -1) {
      mockPricingRules[index] = {
        ...mockPricingRules[index],
        minimum_price: minimumPrice,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy,
      };
      return { success: true };
    }
    return { success: false };
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    await delay(500);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTransactions = mockTransactions.filter((t) => {
      const txDate = new Date(t.created_at);
      return txDate >= today;
    });

    const paidTransactions = todayTransactions.filter((t) => t.status === 'paid');
    const todayRevenue = paidTransactions.reduce((sum, t) => sum + t.price, 0);
    const vehiclesToday = todayTransactions.length;
    const outstandingCredit = mockTransactions
      .filter((t) => t.status === 'credit')
      .reduce((sum, t) => sum + t.price, 0);

    // Revenue by vehicle type
    const revenueByVehicle = paidTransactions.reduce((acc, t) => {
      const existing = acc.find((r) => r.vehicle_type === t.vehicle_type);
      if (existing) {
        existing.revenue += t.price;
      } else {
        acc.push({ vehicle_type: t.vehicle_type, revenue: t.price });
      }
      return acc;
    }, [] as { vehicle_type: VehicleType; revenue: number }[]);

    // Revenue by service type
    const revenueByService = paidTransactions.reduce((acc, t) => {
      const existing = acc.find((r) => r.service_type === t.service_type);
      if (existing) {
        existing.revenue += t.price;
      } else {
        acc.push({ service_type: t.service_type, revenue: t.price });
      }
      return acc;
    }, [] as { service_type: ServiceType; revenue: number }[]);

    return {
      today_revenue: todayRevenue,
      vehicles_today: vehiclesToday,
      outstanding_credit: outstandingCredit,
      revenue_by_vehicle: revenueByVehicle,
      revenue_by_service: revenueByService,
      recent_transactions: mockTransactions.slice(0, 10),
    };
  },
};

// Users mock data
let mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@zoriautospa.com',
    name: 'John Admin',
    role: 'superadmin',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'staff@zoriautospa.com',
    name: 'Mary Staff',
    role: 'admin',
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    email: 'viewer@zoriautospa.com',
    name: 'Tom Viewer',
    role: 'viewer',
    created_at: '2024-02-01T00:00:00Z',
  },
];

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    await delay(300);
    return mockUsers;
  },

  create: async (data: {
    email: string;
    name: string;
    role: 'superadmin' | 'admin' | 'viewer';
    password: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> => {
    await delay(500);

    // Check if email already exists
    if (mockUsers.some((u) => u.email === data.email)) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role,
      created_at: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    return { success: true, user: newUser };
  },

  update: async (
    id: string,
    data: { name?: string; role?: 'superadmin' | 'admin' | 'viewer' }
  ): Promise<{ success: boolean; error?: string }> => {
    await delay(400);

    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      return { success: false, error: 'User not found' };
    }

    mockUsers[index] = {
      ...mockUsers[index],
      ...(data.name && { name: data.name }),
      ...(data.role && { role: data.role }),
    };

    return { success: true };
  },

  delete: async (id: string): Promise<{ success: boolean; error?: string }> => {
    await delay(400);

    // Prevent deleting the last superadmin
    const user = mockUsers.find((u) => u.id === id);
    if (user?.role === 'superadmin') {
      const superAdmins = mockUsers.filter((u) => u.role === 'superadmin');
      if (superAdmins.length === 1) {
        return { success: false, error: 'Cannot delete the last SuperAdmin' };
      }
    }

    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      return { success: false, error: 'User not found' };
    }

    mockUsers.splice(index, 1);
    return { success: true };
  },

  updateProfile: async (
    id: string,
    data: {
      name?: string;
      contact?: string;
      id_number?: string;
      profile_picture?: string;
    }
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    await delay(400);

    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      return { success: false, error: 'User not found' };
    }

    mockUsers[index] = {
      ...mockUsers[index],
      ...(data.name && { name: data.name }),
      ...(data.contact !== undefined && { contact: data.contact }),
      ...(data.id_number !== undefined && { id_number: data.id_number }),
      ...(data.profile_picture !== undefined && { profile_picture: data.profile_picture }),
    };

    return { success: true, user: mockUsers[index] };
  },

  getById: async (id: string): Promise<User | null> => {
    await delay(200);
    return mockUsers.find((u) => u.id === id) || null;
  },
};
