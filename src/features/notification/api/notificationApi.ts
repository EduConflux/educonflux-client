import { apiClient } from '../../../api/client';
import type { NotificationItem } from '../types';

export const notificationApi = {
  getMyNotifications: () => apiClient.get<NotificationItem[]>('/notifications'),
  getUnreadNotifications: () => apiClient.get<NotificationItem[]>('/notifications/unread'),
  getUnreadCount: () => apiClient.get<number>('/notifications/unread/count'),
  markAsRead: (notificationId: number) => apiClient.patch<NotificationItem>(`/notifications/${notificationId}/read`),
  markAllAsRead: () => apiClient.patch<void>('/notifications/read-all'),
};
