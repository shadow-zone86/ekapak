'use client';

import { useState, useCallback } from 'react';
import type { NotificationProps } from '@/shared/ui/notification';

export interface NotificationData extends Omit<NotificationProps, 'id' | 'onClose'> {
  id?: string;
}

export function useNotification() {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = useCallback((notification: NotificationData) => {
    const id = notification.id || `notification-${Date.now()}-${Math.random()}`;
    
    const newNotification: NotificationProps = {
      ...notification,
      id,
      onClose: (notificationId: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      },
    };

    setNotifications((prev) => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
}
