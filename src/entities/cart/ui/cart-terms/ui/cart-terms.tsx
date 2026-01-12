'use client';

import Link from 'next/link';

export interface CartTermsProps {
  agreedToTerms: boolean;
  onTermsChange: (agreed: boolean) => void;
  termsLinkHref?: string;
}

export function CartTerms({
  agreedToTerms,
  onTermsChange,
  termsLinkHref = '#',
}: CartTermsProps) {
  return (
    <div className="cart-terms flex items-start">
      <input
        id="terms-checkbox"
        type="checkbox"
        className="cart-terms__checkbox mt-1 h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
        checked={agreedToTerms}
        onChange={(e) => onTermsChange(e.target.checked)}
      />
      <label htmlFor="terms-checkbox" className="cart-terms__label ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        Я согласен на обработку персональных данных в соответствии с{' '}
        <Link href={termsLinkHref} className="cart-terms__link text-blue-600 hover:underline">
          политикой обработки персональных данных компании
        </Link>
      </label>
    </div>
  );
}
