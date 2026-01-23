'use client';

import { ReactElement } from 'react';
import { Modal } from '@/shared/ui/modal';
import { useAppSelector, useAppDispatch } from '@/shared/config/store-hooks';
import { updatePersonalData } from '@/entities/profile/model/store/profileState';
import type { ProfilePersonalData } from '@/entities/profile/model/types';
import { useNotificationContext } from '@/shared/ui/notification-provider';

export interface ProfileEditPersonalModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: (props: { initialData: ProfilePersonalData; onSubmit: (data: ProfilePersonalData) => void; onCancel: () => void }) => ReactElement;
}

export function ProfileEditPersonalModal({ isOpen, onClose, form }: ProfileEditPersonalModalProps) {
  const personalData = useAppSelector((state) => state.profile.personalData);
  const dispatch = useAppDispatch();
  const { addNotification } = useNotificationContext();

  const handleSubmit = (data: ProfilePersonalData) => {
    dispatch(updatePersonalData(data));
    addNotification({
      type: 'success',
      message: 'Персональные данные успешно обновлены',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Редактировать персональные данные">
      {form({ initialData: personalData, onSubmit: handleSubmit, onCancel: onClose })}
    </Modal>
  );
}
