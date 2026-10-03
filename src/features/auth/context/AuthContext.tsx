import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';
import { queryClient } from '../../../api/queryClient';
import { extractUserFromAuthResponse } from '../../../lib/authUtils';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User, rememberMe?: boolean) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  } catch {
    return null;
  }
}

function getInitialUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // ignore
      }
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token && token.includes('.')) {
      return extractUserFromAuthResponse({ token });
    }
  } catch {
    return null;
  }
  return null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [user, setUserState] = useState<User | null>(getInitialUser);

  const login = (newToken: string, newUser: User, rememberMe: boolean = true) => {
    setToken(newToken);
    setUserState(newUser);

    try {
      if (rememberMe) {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      } else {
        sessionStorage.setItem('token', newToken);
        sessionStorage.setItem('user', JSON.stringify(newUser));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (e) {
      console.warn('Storage operation failed:', e);
    }
  };

  const logout = () => {
    setToken(null);
    setUserState(null);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    } catch (e) {
      // ignore
    }
    queryClient.clear();
  };

  const setUser = (newUser: User) => {
    setUserState(newUser);
    try {
      if (localStorage.getItem('token')) {
        localStorage.setItem('user', JSON.stringify(newUser));
      } else if (sessionStorage.getItem('token')) {
        sessionStorage.setItem('user', JSON.stringify(newUser));
      }
    } catch {
      // ignore
    }
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
