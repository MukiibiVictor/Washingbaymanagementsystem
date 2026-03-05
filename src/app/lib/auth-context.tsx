import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@zoriautospa.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@zoriautospa.com',
      name: 'John Admin',
      role: 'superadmin',
      created_at: '2024-01-01T00:00:00Z',
    },
  },
  'staff@zoriautospa.com': {
    password: 'staff123',
    user: {
      id: '2',
      email: 'staff@zoriautospa.com',
      name: 'Mary Staff',
      role: 'admin',
      created_at: '2024-01-15T00:00:00Z',
    },
  },
  'viewer@zoriautospa.com': {
    password: 'viewer123',
    user: {
      id: '3',
      email: 'viewer@zoriautospa.com',
      name: 'Tom Viewer',
      role: 'viewer',
      created_at: '2024-02-01T00:00:00Z',
    },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('zori_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const userRecord = MOCK_USERS[email];
    if (userRecord && userRecord.password === password) {
      const loggedInUser = {
        ...userRecord.user,
        last_login: new Date().toISOString(),
      };
      setUser(loggedInUser);
      localStorage.setItem('zori_user', JSON.stringify(loggedInUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zori_user');
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
