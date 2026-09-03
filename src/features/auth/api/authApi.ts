import { apiClient } from '../../../api/client';
import type { LoginRequest, LoginResponse, ActivationRequest, ChangePasswordRequest } from '../types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  activateAccount: async (data: ActivationRequest): Promise<string> => {
    return apiClient.post<string>('/auth/activate', data);
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    return apiClient.post<void>('/auth/change-password', data);
  },
};
