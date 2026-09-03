export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  active?: boolean;
}

export interface RoleConfig {
  id: UserRole;
  title: string;
  subtitle: string;
  description: string;
  iconName: 'Shield' | 'GraduationCap' | 'BookOpen' | 'Users';
  badge: string;
}

export interface LoginFormState {
  role: UserRole;
  email: string;
  password: string;
  rememberMe: boolean;
}

export type AuthErrorType = 'VALIDATION' | 'INVALID_CREDENTIALS' | 'NETWORK' | null;

export interface ValidationErrors {
  role?: string;
  email?: string;
  password?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  accessToken?: string;
  user: User;
}

export interface ActivationRequest {
  token: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
