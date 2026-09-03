import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { extractUserFromAuthResponse } from '../../../lib/authUtils';
import type { LoginRequest, LoginResponse, ActivationRequest, ChangePasswordRequest } from '../types';

export function useLoginMutation() {
  const { login } = useAuth();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (data, variables) => {
      const token = data?.token || data?.accessToken || (typeof data === 'string' ? data : '');
      const user = extractUserFromAuthResponse(data, variables.email);
      if (token && user) {
        login(token, user);
      }
    },
  });
}

export function useActivateMutation() {
  return useMutation<string, Error, ActivationRequest>({
    mutationFn: (data) => authApi.activateAccount(data),
  });
}

export function useChangePasswordMutation() {
  return useMutation<void, Error, ChangePasswordRequest>({
    mutationFn: (data) => authApi.changePassword(data),
  });
}
