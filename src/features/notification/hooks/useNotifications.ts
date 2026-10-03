import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/notificationApi';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications', 'all'],
    queryFn: () => notificationApi.getMyNotifications(),
    staleTime: 1000 * 30, // 30s
  });
}

export function useUnreadNotifications() {
  return useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationApi.getUnreadNotifications(),
    refetchInterval: 1000 * 30, // Poll every 30s
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'count'],
    queryFn: () => notificationApi.getUnreadCount(),
    refetchInterval: 1000 * 30,
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
