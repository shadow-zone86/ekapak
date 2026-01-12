'use client';

import { Card, CardHeader, CardBody } from '@/shared/ui/card';
import { H2, PText, Description } from '@/shared/ui/typography';
import { useAppSelector } from '@/shared/config/store-hooks';

export interface ProfileCompanyDataProps {
  editButton: React.ReactNode;
}

export function ProfileCompanyData({ editButton }: ProfileCompanyDataProps) {
  const companyData = useAppSelector((state) => state.profile.companyData);

  return (
    <Card className="profile-card">
      <CardHeader>
        <H2 className="profile-card__title text-black text-xl font-bold">Информация о компании</H2>
      </CardHeader>
      <CardBody>
        <div className="profile-card__content space-y-4">
          <div className="profile-field">
            <Description className="profile-field__label text-gray-600 text-sm mb-1">Название компании</Description>
            <PText className="profile-field__value text-black">{companyData.name}</PText>
          </div>
          <div className="profile-field">
            <Description className="profile-field__label text-gray-600 text-sm mb-1">ИНН</Description>
            <PText className="profile-field__value text-black">{companyData.inn}</PText>
          </div>
          <div className="profile-field">
            <Description className="profile-field__label text-gray-600 text-sm mb-1">КПП</Description>
            <PText className="profile-field__value text-black">{companyData.kpp}</PText>
          </div>
          <div className="profile-field">
            <Description className="profile-field__label text-gray-600 text-sm mb-1">Адрес</Description>
            <PText className="profile-field__value text-black">{companyData.address}</PText>
          </div>
        </div>
        <div className="profile-card__actions mt-6">
          {editButton}
        </div>
      </CardBody>
    </Card>
  );
}
