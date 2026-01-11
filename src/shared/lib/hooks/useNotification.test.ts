import { renderHook, act } from '@testing-library/react';
import { useNotification } from './useNotification';
import type { NotificationData } from './useNotification';

describe('useNotification', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1234567890);
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize with empty notifications array', () => {
    const { result } = renderHook(() => useNotification());

    expect(result.current.notifications).toEqual([]);
    expect(result.current.notifications.length).toBe(0);
  });

  it('should add notification with auto-generated id', () => {
    const { result } = renderHook(() => useNotification());

    const notificationData: NotificationData = {
      message: 'Test notification',
      type: 'info',
    };

    act(() => {
      result.current.addNotification(notificationData);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].message).toBe('Test notification');
    expect(result.current.notifications[0].type).toBe('info');
    expect(result.current.notifications[0].id).toBe('notification-1234567890-0.5');
    expect(result.current.notifications[0].onClose).toBeDefined();
  });

  it('should add notification with provided id', () => {
    const { result } = renderHook(() => useNotification());

    const notificationData: NotificationData = {
      id: 'custom-id-123',
      message: 'Custom notification',
      type: 'success',
    };

    act(() => {
      result.current.addNotification(notificationData);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].id).toBe('custom-id-123');
    expect(result.current.notifications[0].message).toBe('Custom notification');
    expect(result.current.notifications[0].type).toBe('success');
  });

  it('should return notification id when adding notification', () => {
    const { result } = renderHook(() => useNotification());

    const notificationData: NotificationData = {
      message: 'Test notification',
    };

    let notificationId: string;
    act(() => {
      notificationId = result.current.addNotification(notificationData);
    });

    expect(notificationId!).toBe('notification-1234567890-0.5');
    expect(result.current.notifications[0].id).toBe(notificationId!);
  });

  it('should add multiple notifications', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification({ message: 'First notification', id: '1' });
      result.current.addNotification({ message: 'Second notification', id: '2' });
      result.current.addNotification({ message: 'Third notification', id: '3' });
    });

    expect(result.current.notifications).toHaveLength(3);
    expect(result.current.notifications[0].message).toBe('First notification');
    expect(result.current.notifications[1].message).toBe('Second notification');
    expect(result.current.notifications[2].message).toBe('Third notification');
  });

  it('should remove notification by id', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification({ message: 'First', id: '1' });
      result.current.addNotification({ message: 'Second', id: '2' });
      result.current.addNotification({ message: 'Third', id: '3' });
    });

    expect(result.current.notifications).toHaveLength(3);

    act(() => {
      result.current.removeNotification('2');
    });

    expect(result.current.notifications).toHaveLength(2);
    expect(result.current.notifications[0].id).toBe('1');
    expect(result.current.notifications[1].id).toBe('3');
  });

  it('should clear all notifications', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification({ message: 'First', id: '1' });
      result.current.addNotification({ message: 'Second', id: '2' });
      result.current.addNotification({ message: 'Third', id: '3' });
    });

    expect(result.current.notifications).toHaveLength(3);

    act(() => {
      result.current.clearNotifications();
    });

    expect(result.current.notifications).toHaveLength(0);
    expect(result.current.notifications).toEqual([]);
  });

  it('should call onClose to remove notification', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification({ message: 'First', id: '1' });
      result.current.addNotification({ message: 'Second', id: '2' });
    });

    expect(result.current.notifications).toHaveLength(2);

    const firstNotification = result.current.notifications[0];
    act(() => {
      firstNotification.onClose('1');
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].id).toBe('2');
  });

  it('should handle notification with all optional properties', () => {
    const { result } = renderHook(() => useNotification());

    const notificationData: NotificationData = {
      id: 'full-notification',
      title: 'Test Title',
      message: 'Test message',
      type: 'warning',
      autoClose: false,
      duration: 5000,
      closable: false,
    };

    act(() => {
      result.current.addNotification(notificationData);
    });

    const notification = result.current.notifications[0];
    expect(notification.id).toBe('full-notification');
    expect(notification.title).toBe('Test Title');
    expect(notification.message).toBe('Test message');
    expect(notification.type).toBe('warning');
    expect(notification.autoClose).toBe(false);
    expect(notification.duration).toBe(5000);
    expect(notification.closable).toBe(false);
    expect(notification.onClose).toBeDefined();
  });

  it('should not remove notification if id does not exist', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification({ message: 'First', id: '1' });
      result.current.addNotification({ message: 'Second', id: '2' });
    });

    expect(result.current.notifications).toHaveLength(2);

    act(() => {
      result.current.removeNotification('non-existent-id');
    });

    expect(result.current.notifications).toHaveLength(2);
  });

  it('should preserve notification order when removing', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification({ message: 'First', id: '1' });
      result.current.addNotification({ message: 'Second', id: '2' });
      result.current.addNotification({ message: 'Third', id: '3' });
    });

    act(() => {
      result.current.removeNotification('2');
    });

    expect(result.current.notifications[0].id).toBe('1');
    expect(result.current.notifications[1].id).toBe('3');
  });
});
