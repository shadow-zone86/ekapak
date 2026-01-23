'use client';

import { ReactElement } from 'react';
import { Modal } from '@/shared/ui/modal';
import { useAppSelector, useAppDispatch } from '@/shared/config/store-hooks';
import { updateCompanyData } from '@/entities/profile/model/store/profileState';
import type { ProfileCompanyData } from '@/entities/profile/model/types';
import { useNotificationContext } from '@/shared/ui/notification-provider';

export interface ProfileEditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: (props: { initialData: ProfileCompanyData; onSubmit: (data: ProfileCompanyData) => void; onCancel: () => void }) => ReactElement;
}

export function ProfileEditCompanyModal({ isOpen, onClose, form }: ProfileEditCompanyModalProps) {
  const companyData = useAppSelector((state) => state.profile.companyData);
  const dispatch = useAppDispatch();
  const { addNotification } = useNotificationContext();

  const handleSubmit = (data: ProfileCompanyData) => {
    dispatch(updateCompanyData(data));
    addNotification({
      type: 'success',
      message: 'Данные компании успешно обновлены',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Редактировать данные компании">
      {form({ initialData: companyData, onSubmit: handleSubmit, onCancel: onClose })}
    </Modal>
  );
}
