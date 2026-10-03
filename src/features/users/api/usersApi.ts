import { apiClient } from '../../../api/client';
import type { UserRecord, CreateUserRequest, UpdateUserRequest, PageResponse } from '../types';

export const usersApi = {
  getUsers: (params?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<UserRecord>> => {
    const q = new URLSearchParams();
    if (params?.role) q.append('role', params.role);
    if (params?.status) q.append('status', params.status);
    if (params?.search) q.append('search', params.search);
    if (params?.page !== undefined) q.append('page', String(params.page));
    if (params?.size !== undefined) q.append('size', String(params.size));
    const queryStr = q.toString() ? `?${q.toString()}` : '';
    return apiClient.get<PageResponse<UserRecord>>(`/admin/users${queryStr}`);
  },

  getUser: (userId: number): Promise<UserRecord> => {
    return apiClient.get<UserRecord>(`/admin/users/${userId}`);
  },

  createUser: (request: CreateUserRequest): Promise<UserRecord> => {
    return apiClient.post<UserRecord>('/admin/users', request);
  },

  updateUser: (userId: number, request: UpdateUserRequest): Promise<UserRecord> => {
    return apiClient.put<UserRecord>(`/admin/users/${userId}`, request);
  },

  activateUser: (userId: number): Promise<void> => {
    return apiClient.patch<void>(`/admin/users/${userId}/activate`);
  },

  deactivateUser: (userId: number): Promise<void> => {
    return apiClient.patch<void>(`/admin/users/${userId}/deactivate`);
  },

  resetPassword: (userId: number): Promise<void> => {
    return apiClient.patch<void>(`/admin/users/${userId}/reset-password`);
  },
};
