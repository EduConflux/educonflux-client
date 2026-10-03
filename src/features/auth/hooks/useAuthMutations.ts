import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import type { LoginRequest, LoginResponse, ActivationRequest, ChangePasswordRequest } from '../types';

export function useLoginMutation() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (credentials) => authApi.login(credentials),
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
