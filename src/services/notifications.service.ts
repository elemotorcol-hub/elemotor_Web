import { fetchApi } from '@/lib/api';

export interface AppNotification {
  id: number;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  entityId?: number;
  entityType?: string;
}

export const notificationsService = {
  getAll: () => fetchApi('/api/notifications', { method: 'GET' }),
  getUnreadCount: () => fetchApi('/api/notifications/unread-count', { method: 'GET' }) as Promise<{ count: number }>,
  markRead: (id: number) => fetchApi(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => fetchApi('/api/notifications/read-all', { method: 'POST' }),
};
