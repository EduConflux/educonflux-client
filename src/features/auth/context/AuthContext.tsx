import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';
import { queryClient } from '../../../api/queryClient';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function getInitialUser(): User | null {
  if (typeof window === 'undefined') return null;
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch {
      // ignore
    }
  }

  // Fallback JWT parse if token exists
  const token = localStorage.getItem('token');
  if (token && token.includes('.')) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.email || payload.sub || payload.username || '';
      let role = payload.role || (payload.roles && payload.roles[0]) || 'STUDENT';
      if (typeof role === 'string' && role.startsWith('ROLE_')) {
        role = role.replace('ROLE_', '');
      }
      return {
        id: payload.id || payload.userId || 1,
        email,
        firstName: payload.firstName || email.split('@')[0],
        lastName: payload.lastName || '',
        role,
        active: true,
      };
    } catch {
      // ignore
    }
  }
  return null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [user, setUserState] = useState<User | null>(getInitialUser);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUserState(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUserState(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.clear();
  };

  const setUser = (newUser: User) => {
    setUserState(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
