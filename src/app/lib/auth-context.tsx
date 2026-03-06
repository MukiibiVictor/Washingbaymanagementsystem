import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './types';
import { apiClient } from './api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await apiClient.get<{ success: boolean; user: User }>('/auth/me');
          if (response.success) {
            setUser(response.user);
          } else {
            localStorage.removeItem('auth_token');
          }
        } catch {
          localStorage.removeItem('auth_token');
        }
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<{ success: boolean; user: User; token: string }>(
        '/auth/login',
        { email, password }
      );
      
      if (response.success && response.user && response.token) {
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
