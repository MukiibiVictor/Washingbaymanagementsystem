import { apiClient } from './api';
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

// Check-ins API
export const checkInsApi = {
  getAll: async (): Promise<CheckIn[]> => {
    const response = await apiClient.get<{ success: boolean; data: CheckIn[] }>('/checkins');
    return response.data;
  },

  getPending: async (): Promise<CheckIn[]> => {
    const response = await apiClient.get<{ success: boolean; data: CheckIn[] }>('/checkins/pending');
    return response.data;
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
    try {
      const response = await apiClient.put<{ success: boolean; transaction: Transaction }>(
        `/checkins/${id}/confirm`,
        { ...data, admin_name: adminName }
      );
      
      // Emit events for real-time updates
      dataEvents.emit(DATA_EVENTS.CHECKIN_CONFIRMED);
      dataEvents.emit(DATA_EVENTS.TRANSACTION_CREATED);
      
      return { success: true, transaction: response.transaction };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  upload: async (cameraId: number, imageFile: File | string): Promise<CheckIn> => {
    // Handle both File objects and base64 strings
    const imageUrl = typeof imageFile === 'string' 
      ? imageFile // base64 string from camera
      : URL.createObjectURL(imageFile); // File object from upload - in production, upload to server
    
    const response = await apiClient.post<{ success: boolean; data: CheckIn }>('/checkins', {
      camera_id: cameraId,
      image_url: imageUrl,
    });
    
    // Emit event for real-time updates
    dataEvents.emit(DATA_EVENTS.CHECKIN_CREATED);
    
    return response.data;
  },
};

// Transactions API
export const transactionsApi = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<{ success: boolean; data: Transaction[] }>('/transactions');
    return response.data;
  },

  getById: async (id: string): Promise<Transaction | null> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Transaction }>(`/transactions/${id}`);
      return response.data;
    } catch {
      return null;
    }
  },

  getPending: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<{ success: boolean; data: Transaction[] }>('/transactions/pending');
    return response.data;
  },

  getCredit: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<{ success: boolean; data: Transaction[] }>('/transactions/credit');
    return response.data;
  },
};

// Payments API
export const paymentsApi = {
  create: async (
    transactionId: string,
    method: PaymentMethod,
    amount: number,
    createdBy: string,
    phoneNumber?: string
  ): Promise<{ success: boolean; payment?: Payment }> => {
    try {
      const response = await apiClient.post<{ success: boolean; payment: Payment }>(
        `/transactions/${transactionId}/payment`,
        { method, amount, created_by: createdBy, phone_number: phoneNumber }
      );
      
      // Emit events for real-time updates
      dataEvents.emit(DATA_EVENTS.PAYMENT_CREATED);
      dataEvents.emit(DATA_EVENTS.TRANSACTION_UPDATED);
      
      return { success: true, payment: response.payment };
    } catch (error: any) {
      return { success: false };
    }
  },

  getAll: async (): Promise<Payment[]> => {
    const response = await apiClient.get<{ success: boolean; data: Payment[] }>('/payments');
    return response.data || [];
  },
};

// Pricing Rules API
export const pricingRulesApi = {
  getAll: async (): Promise<PricingRule[]> => {
    const response = await apiClient.get<{ success: boolean; data: PricingRule[] }>('/pricing');
    return response.data;
  },

  update: async (
    id: string,
    minimumPrice: number,
    updatedBy: string
  ): Promise<{ success: boolean }> => {
    try {
      await apiClient.put(`/pricing/${id}`, {
        minimum_price: minimumPrice,
        updated_by: updatedBy,
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
    return response.data;
  },
};

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<{ success: boolean; data: User[] }>('/users');
    return response.data;
  },

  create: async (data: {
    email: string;
    name: string;
    role: 'superadmin' | 'admin' | 'viewer';
    password: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      // If creating a viewer account, use public registration endpoint
      if (data.role === 'viewer') {
        const response = await apiClient.post<{ success: boolean; user: User }>('/auth/register', {
          email: data.email,
          name: data.name,
          password: data.password,
        });
        return { success: true, user: response.user };
      }
      
      // Otherwise use admin endpoint for creating admin/superadmin accounts
      const response = await apiClient.post<{ success: boolean; user: User }>('/users', data);
      return { success: true, user: response.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  update: async (
    id: string,
    data: { name?: string; role?: 'superadmin' | 'admin' | 'viewer' }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await apiClient.put(`/users/${id}`, data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await apiClient.delete(`/users/${id}`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
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
    try {
      const response = await apiClient.put<{ success: boolean; user: User }>(`/users/${id}/profile`, data);
      return { success: true, user: response.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getById: async (id: string): Promise<User | null> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: User }>(`/users/${id}`);
      return response.data;
    } catch {
      return null;
    }
  },
};

// Expenses API
export const expensesApi = {
  getAll: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: any[] }>('/expenses');
      return response.data;
    } catch {
      return [];
    }
  },

  create: async (data: {
    category: string;
    description: string;
    amount: number;
    date: string;
    created_by: string;
  }): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const response = await apiClient.post<{ success: boolean; data: any }>('/expenses', data);
      
      // Emit event for real-time updates
      dataEvents.emit(DATA_EVENTS.EXPENSE_CREATED);
      
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  update: async (id: string, data: any): Promise<{ success: boolean; error?: string }> => {
    try {
      await apiClient.put(`/expenses/${id}`, data);
      
      // Emit event for real-time updates
      dataEvents.emit(DATA_EVENTS.EXPENSE_UPDATED);
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await apiClient.delete(`/expenses/${id}`);
      
      // Emit event for real-time updates
      dataEvents.emit(DATA_EVENTS.EXPENSE_UPDATED);
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// Services API (Public - no auth required)
export const servicesApi = {
  getAll: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: any[] }>('/services');
      return response.data;
    } catch {
      return [];
    }
  },

  create: async (data: {
    title: string;
    description: string;
    features: string[];
    image_url?: string;
    price_range: string;
    duration: string;
  }): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const response = await apiClient.post<{ success: boolean; data: any }>('/services', data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  update: async (id: string, data: any): Promise<{ success: boolean; error?: string }> => {
    try {
      await apiClient.put(`/services/${id}`, data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await apiClient.delete(`/services/${id}`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};

// Footer API (Public read, superadmin write)
export const footerApi = {
  get: async (): Promise<any> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: any }>('/footer');
      return response.data;
    } catch {
      return null;
    }
  },

  update: async (data: any): Promise<{ success: boolean; error?: string }> => {
    try {
      await apiClient.put('/footer', data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};
