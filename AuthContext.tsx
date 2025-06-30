import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserHistory: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('linklens_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('linklens_user', JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('linklens_users') || '[]');
    const existingUser = existingUsers.find((u: User) => u.email === email);
    
    if (existingUser) {
      // Load existing user with their history
      setUser(existingUser);
      localStorage.setItem('linklens_user', JSON.stringify(existingUser));
      return true;
    }
    
    // Mock authentication for new users
    if (email && password.length >= 6) {
      const userData: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        scanHistory: []
      };
      
      // Save to users list
      const updatedUsers = [...existingUsers, userData];
      localStorage.setItem('linklens_users', JSON.stringify(updatedUsers));
      
      setUser(userData);
      localStorage.setItem('linklens_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('linklens_users') || '[]');
    const userExists = existingUsers.some((u: User) => u.email === email);
    
    if (userExists) {
      return false; // User already exists
    }
    
    if (email && password.length >= 6 && name) {
      const userData: User = {
        id: Date.now().toString(),
        email,
        name,
        scanHistory: []
      };
      
      // Save to users list
      const updatedUsers = [...existingUsers, userData];
      localStorage.setItem('linklens_users', JSON.stringify(updatedUsers));
      
      setUser(userData);
      localStorage.setItem('linklens_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const updateUserHistory = (updatedUser: User) => {
    setUser(updatedUser);
    
    // Update in users list as well
    const existingUsers = JSON.parse(localStorage.getItem('linklens_users') || '[]');
    const updatedUsers = existingUsers.map((u: User) => 
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem('linklens_users', JSON.stringify(updatedUsers));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('linklens_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user,
      updateUserHistory
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};