'use client';

import { ReactElement } from 'react';
import { Modal } from '@/shared/ui/modal';
import { useNotificationContext } from '@/shared/ui/notification-provider';
import { OrderSampleFormData } from '@/entities/orders/model/types';

export interface OrderSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: (props: {
    onSubmit: (data: OrderSampleFormData) => void | Promise<void>;
    onCancel: () => void;
  }) => ReactElement;
}

export function OrderSampleModal({ isOpen, onClose, form }: OrderSampleModalProps) {
  const { addNotification } = useNotificationContext();

  const handleSubmit = async (data: OrderSampleFormData) => {
    try {
      // Здесь будет API запрос
      // await orderSampleApi.createOrder(data);
      void data; // Параметр будет использован при реализации API

      // Имитация запроса
      await new Promise((resolve) => setTimeout(resolve, 1000));

      addNotification({
        type: 'success',
        message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
      });

      onClose();
    } catch {
      addNotification({
        type: 'error',
        message: 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Заказать образец">
      {form({ onSubmit: handleSubmit, onCancel: onClose })}
    </Modal>
  );
}
