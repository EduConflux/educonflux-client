export type UserRole = "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";

export interface RoleConfig {
  id: UserRole;
  title: string;
  subtitle: string;
  description: string;
  iconName: "Shield" | "GraduationCap" | "BookOpen" | "Users";
  badge: string;
}

export interface LoginFormState {
  role: UserRole;
  email: string;
  password: string;
  rememberMe: boolean;
}

export type AuthErrorType = "VALIDATION" | "INVALID_CREDENTIALS" | "NETWORK" | null;

export interface ValidationErrors {
  role?: string;
  email?: string;
  password?: string;
}
