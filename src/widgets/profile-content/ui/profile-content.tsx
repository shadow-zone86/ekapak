'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { ProfilePersonalData } from '@/entities/profile/ui/profile-personal-data';
import { ProfileCompanyData } from '@/entities/profile/ui/profile-company-data';
import { ProfileStats } from '@/entities/profile/ui/profile-stats';
import { ProfileQuickActions } from '@/entities/profile/ui/profile-quick-actions';
import { ProfileEditPersonalModal } from '@/entities/profile/ui/profile-edit-personal-modal';
import { ProfileEditCompanyModal } from '@/entities/profile/ui/profile-edit-company-modal';
import { ProfileEditPersonalForm } from '@/features/profile-edit-personal';
import { ProfileEditCompanyForm } from '@/features/profile-edit-company';

export function ProfileContent() {
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  return (
    <>
      <div className="profile-page__content grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-2 space-y-6">
          <ProfilePersonalData
            editButton={
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => setIsPersonalModalOpen(true)}
              >
                Редактировать данные
              </Button>
            }
          />
          <ProfileCompanyData
            editButton={
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => setIsCompanyModalOpen(true)}
              >
                Редактировать компанию
              </Button>
            }
          />
        </div>

        {/* Боковая панель */}
        <div className="lg:col-span-1 space-y-6">
          <ProfileStats />
          <ProfileQuickActions />
        </div>
      </div>

      <ProfileEditPersonalModal
        isOpen={isPersonalModalOpen}
        onClose={() => setIsPersonalModalOpen(false)}
        form={(props) => <ProfileEditPersonalForm {...props} />}
      />
      <ProfileEditCompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        form={(props) => <ProfileEditCompanyForm {...props} />}
      />
    </>
  );
}
