'use client';

import { useMobileMenuContext } from '@/shared/lib/hooks';

export function MobileMenuButton() {
  const { isOpen, toggle } = useMobileMenuContext();

  return (
    <button
      onClick={toggle}
      className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
      aria-label="Menu"
      aria-expanded={isOpen}
    >
      <div className="flex flex-col gap-1.5 w-5">
        <span
          className={`block h-0.5 w-full bg-black transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-2.5' : ''
          }`}
        />
        <span
          className={`block h-0.5 w-full bg-black transition-all duration-300 ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block h-0.5 w-full bg-black transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-2.5' : ''
          }`}
        />
      </div>
    </button>
  );
}
