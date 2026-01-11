import Image from 'next/image';
import { Price } from '@/shared/ui/typography';
import { Tooltip } from '@/shared/ui/tooltip';

interface CardPriceProps {
  price: number;
  currencySymbol: string;
  unit: string;
}

export function CardPrice({ price, currencySymbol, unit }: CardPriceProps) {
  return (
    <>
      <Price className="text-black text-lg font-bold">
        {price.toFixed(2)} {currencySymbol}
      </Price>
      <span className="text-gray text-xs">/ {unit}</span>
      <sup className="inline-block">
        <Tooltip text="С НДС 20%">
          <button
            className="cursor-pointer w-[13px] h-[13px] rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors"
            aria-label="Информация о НДС"
          >
            <Image
              src="/asterisk.svg"
              alt="Астерикс"
              width={13}
              height={13}
              className="opacity-100"
              style={{ filter: 'brightness(0) saturate(100%) invert(47%) sepia(96%) saturate(2602%) hue-rotate(164deg) brightness(102%) contrast(101%)' }}
            />
          </button>
        </Tooltip>
      </sup>
    </>
  );
}
