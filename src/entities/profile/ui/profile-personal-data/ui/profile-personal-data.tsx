'use client';

import { Card, CardHeader, CardBody } from '@/shared/ui/card';
import { H2, PText, Description } from '@/shared/ui/typography';
import { useAppSelector } from '@/shared/config/store-hooks';

export interface ProfilePersonalDataProps {
  editButton: React.ReactNode;
}

export function ProfilePersonalData({ editButton }: ProfilePersonalDataProps) {
  const personalData = useAppSelector((state) => state.profile.personalData);

  return (
    <Card className="profile-card">
      <CardHeader>
        <H2 className="profile-card__title text-black text-xl font-bold">Личные данные</H2>
      </CardHeader>
      <CardBody>
        <div className="profile-card__content space-y-4">
          <div className="profile-field">
            <Description className="profile-field__label text-gray-600 text-sm mb-1">ФИО</Description>
            <PText className="profile-field__value text-black">{personalData.fullName}</PText>
          </div>
          <div className="profile-field">
            <Description className="profile-field__label text-gray-600 text-sm mb-1">Email</Description>
            <PText className="profile-field__value text-black">{personalData.email}</PText>
          </div>
          <div className="profile-field">
            <Description className="profile-field__label text-gray-600 text-sm mb-1">Телефон</Description>
            <PText className="profile-field__value text-black">{personalData.phone}</PText>
          </div>
          <div className="profile-field">
            <Description className="profile-field__label text-gray-600 text-sm mb-1">Должность</Description>
            <PText className="profile-field__value text-black">{personalData.position}</PText>
          </div>
        </div>
        <div className="profile-card__actions mt-6">
          {editButton}
        </div>
      </CardBody>
    </Card>
  );
}
