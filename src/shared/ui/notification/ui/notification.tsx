'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/utils';

export interface NotificationProps {
  id: string;
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  autoClose?: boolean;
  duration?: number;
  closable?: boolean;
  onClose: (id: string) => void;
}

export function Notification({
  id,
  title,
  message,
  type = 'info',
  autoClose = true,
  duration = 7000,
  closable = true,
  onClose,
}: NotificationProps) {
  const [progressWidth, setProgressWidth] = useState(100);
  const showProgress = autoClose;
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!autoClose || !duration) return;

    const progressStep = 100 / (duration / 100);
    const intervalId = setInterval(() => {
      setProgressWidth((prev) => {
        const newWidth = prev - progressStep;
        if (newWidth <= 0) {
          // Use setTimeout to avoid calling setState during render
          setTimeout(() => {
            onClose(id);
          }, 0);
          return 0;
        }
        return newWidth;
      });
    }, 100);

    progressIntervalRef.current = intervalId;

    return () => {
      const currentInterval = progressIntervalRef.current;
      const currentTimeout = closeTimeoutRef.current;
      if (currentInterval) {
        clearInterval(currentInterval);
        progressIntervalRef.current = null;
      }
      if (currentTimeout) {
        clearTimeout(currentTimeout);
        closeTimeoutRef.current = null;
      }
    };
  }, [autoClose, duration, id, onClose]);

  const handleClose = () => {
    onClose(id);
  };

  const typeStyles = {
    info: 'border-l-[#3b82f6]',
    success: 'border-l-[#019a79]',
    warning: 'border-l-[#e5780b]',
    error: 'border-l-[#e6372e]',
  };

  const iconStyles = {
    info: 'bg-[#3b82f6]/15',
    success: 'bg-[#019a79]/15',
    warning: 'bg-[#e5780b]/15',
    error: 'bg-[#e6372e]/15',
  };

  const progressColors = {
    info: 'bg-[#3b82f6]',
    success: 'bg-[#019a79]',
    warning: 'bg-[#e5780b]',
    error: 'bg-[#e6372e]',
  };

  return (
    <div
      className={cn(
        'notification',
        `notification--${type}`,
        'relative flex items-start gap-3 p-4 bg-white rounded-xl shadow-lg border-l-4 min-w-[320px] max-w-[480px] animate-slide-in-up',
        typeStyles[type]
      )}
    >
      {/* Close button */}
      {closable && (
        <button
          onClick={handleClose}
          className="notification__close absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-smooth active:scale-95 z-10"
          aria-label="Закрыть уведомление"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12M4 4l8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* Icon */}
      <div
        className={cn(
          'notification__icon',
          'flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0',
          iconStyles[type]
        )}
      >
        {type === 'success' && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.333 4L6 11.333 2.667 8"
              stroke="#019a79"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {type === 'error' && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12M4 4l8 8"
              stroke="#e6372e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {type === 'warning' && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 5.333V8M8 10.667h.007M14.667 8A6.667 6.667 0 1 1 1.333 8a6.667 6.667 0 0 1 13.334 0Z"
              stroke="#e5780b"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {type === 'info' && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 7.333V11.333M8 4.667h.007M14.667 8A6.667 6.667 0 1 1 1.333 8a6.667 6.667 0 0 1 13.334 0Z"
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="notification__content flex-1 min-w-0">
        {title && (
          <h3 className="notification__title mb-1 text-base font-semibold leading-tight text-gray-900">{title}</h3>
        )}
        <p className="notification__message text-sm leading-relaxed text-gray-600 break-words">{message}</p>
      </div>

      {/* Progress bar */}
      {autoClose && showProgress && (
        <div className="notification__progress-wrapper absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 overflow-hidden rounded-b-xl">
          <div
            className={cn('notification__progress', 'h-full transition-all duration-100', progressColors[type])}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      )}
    </div>
  );
}
