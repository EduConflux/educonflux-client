import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';
import type { CreateUserRequest } from '../types';

export function useUsersList(params?: {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => usersApi.getUsers(params),
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateUserRequest) => usersApi.createUser(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'admin'] });
    },
  });
}

export function useToggleUserStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, active }: { userId: number; active: boolean }) =>
      active ? usersApi.activateUser(userId) : usersApi.deactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (userId: number) => usersApi.resetPassword(userId),
  });
}
