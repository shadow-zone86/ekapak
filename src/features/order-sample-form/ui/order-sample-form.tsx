'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/shared/ui/button';
import { Description } from '@/shared/ui/typography';
import { OrderSampleFormData } from '../model/types';

export interface OrderSampleFormProps {
  onSubmit?: (data: OrderSampleFormData) => void;
  onCancel?: () => void;
}

export function OrderSampleForm({ onSubmit, onCancel }: OrderSampleFormProps) {
  const [formData, setFormData] = useState<OrderSampleFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    comment: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrderSampleFormData, string>>>({});

  const handleChange = (field: keyof OrderSampleFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OrderSampleFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Обязательное поле';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Обязательное поле';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Обязательное поле';
    } else if (!/^[\d\s()+-\s]+$/.test(formData.phone)) {
      newErrors.phone = 'Некорректный телефон';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="order-sample-form">
      <div className="order-sample-form__fields space-y-4">
        {/* ФИО */}
        <div className="order-sample-form__field">
          <label htmlFor="name" className="order-sample-form__label block mb-1.5">
            <Description className="text-black text-sm font-medium">
              ФИО <span className="text-red-500">*</span>
            </Description>
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            className={`order-sample-form__input w-full rounded-lg border px-4 py-2.5 text-p focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-smooth ${
              errors.name
                ? 'border-red-500 bg-red-50'
                : 'border-stroke bg-white'
            }`}
            placeholder="Иванов Иван Иванович"
          />
          {errors.name && (
            <Description className="order-sample-form__error mt-1 text-red-500 text-xs">
              {errors.name}
            </Description>
          )}
        </div>

        {/* Email */}
        <div className="order-sample-form__field">
          <label htmlFor="email" className="order-sample-form__label block mb-1.5">
            <Description className="text-black text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </Description>
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            className={`order-sample-form__input w-full rounded-lg border px-4 py-2.5 text-p focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-smooth ${
              errors.email
                ? 'border-red-500 bg-red-50'
                : 'border-stroke bg-white'
            }`}
            placeholder="ivan@example.com"
          />
          {errors.email && (
            <Description className="order-sample-form__error mt-1 text-red-500 text-xs">
              {errors.email}
            </Description>
          )}
        </div>

        {/* Телефон */}
        <div className="order-sample-form__field">
          <label htmlFor="phone" className="order-sample-form__label block mb-1.5">
            <Description className="text-black text-sm font-medium">
              Телефон <span className="text-red-500">*</span>
            </Description>
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            className={`order-sample-form__input w-full rounded-lg border px-4 py-2.5 text-p focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-smooth ${
              errors.phone
                ? 'border-red-500 bg-red-50'
                : 'border-stroke bg-white'
            }`}
            placeholder="+7 (999) 123-45-67"
          />
          {errors.phone && (
            <Description className="order-sample-form__error mt-1 text-red-500 text-xs">
              {errors.phone}
            </Description>
          )}
        </div>

        {/* Компания */}
        <div className="order-sample-form__field">
          <label htmlFor="company" className="order-sample-form__label block mb-1.5">
            <Description className="text-black text-sm font-medium">Компания</Description>
          </label>
          <input
            id="company"
            type="text"
            value={formData.company}
            onChange={handleChange('company')}
            className="order-sample-form__input w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-p focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-smooth"
            placeholder="ООО «Компания»"
          />
        </div>

        {/* Комментарий */}
        <div className="order-sample-form__field">
          <label htmlFor="comment" className="order-sample-form__label block mb-1.5">
            <Description className="text-black text-sm font-medium">Комментарий</Description>
          </label>
          <textarea
            id="comment"
            value={formData.comment}
            onChange={handleChange('comment')}
            rows={4}
            className="order-sample-form__textarea w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-p focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-smooth resize-none"
            placeholder="Дополнительная информация..."
          />
        </div>
      </div>

      <div className="order-sample-form__actions mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Отмена
          </Button>
        )}
        <Button type="submit" variant="primary" className="w-full sm:w-auto">
          Отправить заявку
        </Button>
      </div>
    </form>
  );
}
