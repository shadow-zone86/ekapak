'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Notification } from '@/shared/ui/notification';
import type { NotificationProps } from '@/shared/ui/notification';

export interface NotificationData extends Omit<NotificationProps, 'id' | 'onClose'> {
  id?: string;
}

interface NotificationContextValue {
  addNotification: (notification: NotificationData) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
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

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification, clearNotifications }}>
      {children}
      {/* Notification container */}
      <div className="notification-provider__container fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-[480px]">
        {notifications.map((notification) => (
          <Notification key={notification.id} {...notification} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
}
