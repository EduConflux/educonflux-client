import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  active?: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const initialToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
const initialUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
let initialUser: User | null = null;

if (initialUserStr) {
  try {
    initialUser = JSON.parse(initialUserStr);
  } catch (e) {
    initialUser = null;
  }
}

// Fallback: If token exists but user was not stored, decode from JWT
if (!initialUser && initialToken && initialToken.includes('.')) {
  try {
    const base64 = initialToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    const email = payload.email || payload.sub || payload.username || '';
    const role = (payload.role || (Array.isArray(payload.roles) ? payload.roles[0] : 'STUDENT')).replace('ROLE_', '') as User['role'];
    let firstName = payload.firstName || '';
    let lastName = payload.lastName || '';
    if (!firstName && email) {
      const parts = email.split('@')[0].split(/[._-]/).filter(Boolean);
      firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Student';
      lastName = parts.slice(1).map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }
    initialUser = {
      id: payload.id || payload.userId || 1,
      email,
      firstName,
      lastName,
      role,
      active: true
    };
  } catch (e) {
    initialUser = null;
  }
}

const initialState: AuthState = {
  token: initialToken,
  user: initialUser,
  isAuthenticated: Boolean(initialToken),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user?: User }>
    ) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
      
      if (action.payload.user) {
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
