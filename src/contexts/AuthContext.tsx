import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiService } from '../services/api';
import type { User } from '../types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const initializeAuth = async () => {
      try {
        const storedToken = apiService.getToken();
        const storedUser = apiService.getUser();
        
        console.log('Auth init - Token exists:', !!storedToken);
        console.log('Auth init - User exists:', !!storedUser);
        
        if (storedToken && storedUser) {
          // Check if user is admin first
          if (storedUser.role !== 'admin') {
            console.log('Auth init - User is not admin, clearing data');
            apiService.logout();
            setIsLoading(false);
            return;
          }

          // For page refresh, trust stored token and user data initially
          // Don't validate token during initialization to prevent logout
          console.log('Auth init - Restoring auth state from storage');
          setToken(storedToken);
          setUser(storedUser);
          setIsAuthenticated(true);
          
        } else {
          console.log('Auth init - No stored token or user');
        }
      } catch (error) {
        console.error('Auth init - Error:', error);
        // Don't immediately logout on initialization errors
        // This prevents logout on page refresh due to temporary issues
      } finally {
        // Set loading to false after initialization
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  const login = (newToken: string, userData: User) => {
    // Only allow login if user is admin
    if (userData.role !== 'admin') {
      throw new Error('Akses ditolak. Hanya admin yang diizinkan.');
    }
    
    console.log('Login - Setting auth state');
    console.log('Login - User role:', userData.role);
    console.log('Login - Token length:', newToken.length);
    
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userData', JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    
    console.log('Login - Auth state set successfully');
  };

  const logout = () => {
    apiService.logout();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, isLoading, login, logout }}>
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