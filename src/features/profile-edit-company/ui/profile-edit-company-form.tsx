'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { Description } from '@/shared/ui/typography';
import type { ProfileCompanyData } from '@/entities/profile/model/profileState';

export interface ProfileEditCompanyFormProps {
  initialData: ProfileCompanyData;
  onSubmit: (data: ProfileCompanyData) => void;
  onCancel: () => void;
}

export function ProfileEditCompanyForm({
  initialData,
  onSubmit,
  onCancel,
}: ProfileEditCompanyFormProps) {
  const [formData, setFormData] = useState<ProfileCompanyData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileCompanyData, string>>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof ProfileCompanyData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProfileCompanyData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Обязательное поле';
    }

    if (!formData.inn.trim()) {
      newErrors.inn = 'Обязательное поле';
    } else if (!/^\d{10}$|^\d{12}$/.test(formData.inn.replace(/\s/g, ''))) {
      newErrors.inn = 'ИНН должен содержать 10 или 12 цифр';
    }

    if (!formData.kpp.trim()) {
      newErrors.kpp = 'Обязательное поле';
    } else if (!/^\d{9}$/.test(formData.kpp.replace(/\s/g, ''))) {
      newErrors.kpp = 'КПП должен содержать 9 цифр';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Обязательное поле';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="profile-edit-company-form">
      <div className="profile-edit-company-form__fields space-y-4">
        {/* Название компании */}
        <div className="profile-edit-company-form__field">
          <label htmlFor="name" className="profile-edit-company-form__label block mb-1.5">
            <Description className="text-black text-sm font-medium">
              Название компании <span className="text-red-500">*</span>
            </Description>
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            className={`profile-edit-company-form__input w-full rounded-lg border px-4 py-2.5 text-p focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-smooth ${
              errors.name
                ? 'border-red-500 bg-red-50'
                : 'border-stroke bg-white'
            }`}
            placeholder='ООО "Компания"'
          />
          {errors.name && (
            <Description className="profile-edit-company-form__error mt-1 text-red-500 text-xs">
              {errors.name}
            </Description>
          )}
        </div>

        {/* ИНН */}
        <div className="profile-edit-company-form__field">
          <label htmlFor="inn" className="profile-edit-company-form__label block mb-1.5">
            <Description className="text-black text-sm font-medium">
              ИНН <span className="text-red-500">*</span>
            </Description>
          </label>
          <input
            id="inn"
            type="text"
            value={formData.inn}
            onChange={handleChange('inn')}
            className={`profile-edit-company-form__input w-full rounded-lg border px-4 py-2.5 text-p focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-smooth ${
              errors.inn
                ? 'border-red-500 bg-red-50'
                : 'border-stroke bg-white'
            }`}
            placeholder="7700123456"
          />
          {errors.inn && (
            <Description className="profile-edit-company-form__error mt-1 text-red-500 text-xs">
              {errors.inn}
            </Description>
          )}
        </div>

        {/* КПП */}
        <div className="profile-edit-company-form__field">
          <label htmlFor="kpp" className="profile-edit-company-form__label block mb-1.5">
            <Description className="text-black text-sm font-medium">
              КПП <span className="text-red-500">*</span>
            </Description>
          </label>
          <input
            id="kpp"
            type="text"
            value={formData.kpp}
            onChange={handleChange('kpp')}
            className={`profile-edit-company-form__input w-full rounded-lg border px-4 py-2.5 text-p focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-smooth ${
              errors.kpp
                ? 'border-red-500 bg-red-50'
                : 'border-stroke bg-white'
            }`}
            placeholder="770001001"
          />
          {errors.kpp && (
            <Description className="profile-edit-company-form__error mt-1 text-red-500 text-xs">
              {errors.kpp}
            </Description>
          )}
        </div>

        {/* Адрес */}
        <div className="profile-edit-company-form__field">
          <label htmlFor="address" className="profile-edit-company-form__label block mb-1.5">
            <Description className="text-black text-sm font-medium">
              Адрес <span className="text-red-500">*</span>
            </Description>
          </label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={handleChange('address')}
            className={`profile-edit-company-form__input w-full rounded-lg border px-4 py-2.5 text-p focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-smooth ${
              errors.address
                ? 'border-red-500 bg-red-50'
                : 'border-stroke bg-white'
            }`}
            placeholder="г. Москва, ул. Примерная, д. 1, офис 101"
          />
          {errors.address && (
            <Description className="profile-edit-company-form__error mt-1 text-red-500 text-xs">
              {errors.address}
            </Description>
          )}
        </div>
      </div>

      <div className="profile-edit-company-form__actions mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Отмена
        </Button>
        <Button type="submit" variant="primary" className="w-full sm:w-auto">
          Сохранить
        </Button>
      </div>
    </form>
  );
}
