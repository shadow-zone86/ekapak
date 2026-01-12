'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { Description } from '@/shared/ui/typography';
import type { ProfilePersonalData } from '@/entities/profile/model/profileState';

export interface ProfileEditPersonalFormProps {
  initialData: ProfilePersonalData;
  onSubmit: (data: ProfilePersonalData) => void;
  onCancel: () => void;
}

export function ProfileEditPersonalForm({
  initialData,
  onSubmit,
  onCancel,
}: ProfileEditPersonalFormProps) {
  const [formData, setFormData] = useState<ProfilePersonalData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfilePersonalData, string>>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof ProfilePersonalData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProfilePersonalData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Обязательное поле';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Обязательное поле';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Обязательное поле';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Обязательное поле';
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
    <form onSubmit={handleSubmit} className="profile-edit-personal-form">
      <div className="profile-edit-personal-form__fields space-y-4">
        {/* ФИО */}
        <div className="profile-edit-personal-form__field">
          <label htmlFor="fullName" className="profile-edit-personal-form__label block mb-1.5">
            <Description className="text-black text-sm font-medium">
              ФИО <span className="text-red-500">*</span>
            </Description>
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange('fullName')}
            className={`profile-edit-personal-form__input w-full rounded-lg border px-4 py-2.5 text-p focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-smooth ${
              errors.fullName
                ? 'border-red-500 bg-red-50'
                : 'border-stroke bg-white'
            }`}
            placeholder="Иванов Иван Иванович"
          />
          {errors.fullName && (
            <Description className="profile-edit-personal-form__error mt-1 text-red-500 text-xs">
              {errors.fullName}
            </Description>
          )}
        </div>

        {/* Email */}
        <div className="profile-edit-personal-form__field">
          <label htmlFor="email" className="profile-edit-personal-form__label block mb-1.5">
            <Description className="text-black text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </Description>
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            className={`profile-edit-personal-form__input w-full rounded-lg border px-4 py-2.5 text-p focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-smooth ${
              errors.email
                ? 'border-red-500 bg-red-50'
                : 'border-stroke bg-white'
            }`}
            placeholder="ivan@example.com"
          />
          {errors.email && (
            <Description className="profile-edit-personal-form__error mt-1 text-red-500 text-xs">
              {errors.email}
            </Description>
          )}
        </div>

        {/* Телефон */}
        <div className="profile-edit-personal-form__field">
          <label htmlFor="phone" className="profile-edit-personal-form__label block mb-1.5">
            <Description className="text-black text-sm font-medium">
              Телефон <span className="text-red-500">*</span>
            </Description>
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            className={`profile-edit-personal-form__input w-full rounded-lg border px-4 py-2.5 text-p focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-smooth ${
              errors.phone
                ? 'border-red-500 bg-red-50'
                : 'border-stroke bg-white'
            }`}
            placeholder="+7 (999) 123-45-67"
          />
          {errors.phone && (
            <Description className="profile-edit-personal-form__error mt-1 text-red-500 text-xs">
              {errors.phone}
            </Description>
          )}
        </div>

        {/* Должность */}
        <div className="profile-edit-personal-form__field">
          <label htmlFor="position" className="profile-edit-personal-form__label block mb-1.5">
            <Description className="text-black text-sm font-medium">
              Должность <span className="text-red-500">*</span>
            </Description>
          </label>
          <input
            id="position"
            type="text"
            value={formData.position}
            onChange={handleChange('position')}
            className={`profile-edit-personal-form__input w-full rounded-lg border px-4 py-2.5 text-p focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-smooth ${
              errors.position
                ? 'border-red-500 bg-red-50'
                : 'border-stroke bg-white'
            }`}
            placeholder="Менеджер по закупкам"
          />
          {errors.position && (
            <Description className="profile-edit-personal-form__error mt-1 text-red-500 text-xs">
              {errors.position}
            </Description>
          )}
        </div>
      </div>

      <div className="profile-edit-personal-form__actions mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
