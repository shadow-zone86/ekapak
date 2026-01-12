'use client';

import { PText } from '@/shared/ui/typography';
import { Tooltip } from '@/shared/ui/tooltip';

export interface CartUrgentOrderProps {
  isUrgent: boolean;
  onUrgentChange: (isUrgent: boolean) => void;
}

export function CartUrgentOrder({ isUrgent, onUrgentChange }: CartUrgentOrderProps) {
  return (
    <div className="cart-urgent-order flex items-center justify-between rounded-lg border border-stroke p-3">
      <div className="cart-urgent-order__label flex items-center gap-2">
        <PText className="cart-urgent-order__text text-black font-bold">Срочный заказ:</PText>
        <Tooltip text="Срочный заказ может быть выполнен быстрее, но может повлечь дополнительные расходы.">
          <div className="cart-urgent-order__hint flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-gray-200">
            <span className="text-gray-600 text-xs font-semibold leading-none">?</span>
          </div>
        </Tooltip>
      </div>
      <label className="cart-urgent-order__toggle relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={isUrgent}
          onChange={(e) => onUrgentChange(e.target.checked)}
        />
        <div className="cart-urgent-order__toggle-slider peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-4 peer-checked:after:border-white"></div>
      </label>
    </div>
  );
}
