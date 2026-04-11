import { createContext, useContext, ReactNode } from 'react';
import ApiClient from '../api';


interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = null;
  const login = async (_email: string, _password: string) => {
    // Implementation would go here
  };
const logout = async () => {
    const apiClient = new ApiClient();
    try {
      await apiClient.logout();
    } catch (e) {
      console.warn('Logout API failed, clearing local state:', e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('readNotifications');
    window.location.href = '/';
  };

  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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
