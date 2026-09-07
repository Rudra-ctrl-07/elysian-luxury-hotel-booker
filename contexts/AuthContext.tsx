import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import * as authService from '../utils/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<User>;
  signup: (firstName: string, lastName: string, email: string, pass: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for logged in user on mount
    const loggedInUser = authService.getCurrentUser();
    if (loggedInUser) {
        setUser(loggedInUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    const loggedInUser = await authService.login(email, pass);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const signup = async (firstName: string, lastName: string, email: string, pass: string): Promise<User> => {
    const newUser = await authService.signup(firstName, lastName, email, pass);
    setUser(newUser);
    return newUser;
  };
  
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
