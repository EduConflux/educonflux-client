export type UserAccountStatus = 'ACTIVE' | 'INACTIVE';

export interface UserRecord {
  id: number;
  institutionId?: number;
  email: string;
  personalEmail?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImageUrl?: string;
  status: UserAccountStatus;
  roles: string[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
  firstLogin: boolean;
}

export interface CreateUserRequest {
  email: string;
  personalEmail: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImageUrl?: string;
  role: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  personalEmail?: string;
  phone?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
