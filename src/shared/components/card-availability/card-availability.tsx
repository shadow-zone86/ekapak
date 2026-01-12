import Image from 'next/image';
import { Tooltip } from '@/shared/ui/tooltip';
import { cn } from '@/shared/lib/utils';

interface CardAvailabilityProps {
  availability: string;
  availabilityColor: string;
  isInStock: boolean;
  withBackground?: boolean;
}

export function CardAvailability({ availability, availabilityColor, isInStock, withBackground = false }: CardAvailabilityProps) {
  const backgroundColor = withBackground
    ? availabilityColor === '#2AC84D'
      ? '#EDFFF1'
      : '#F5F7FB'
    : undefined;

  return (
    <>
      <span
        className={cn(
          'card-availability__text text-description text-xs',
          withBackground && 'px-2.5 py-2.5 rounded-md'
        )}
        style={{
          color: availabilityColor,
          backgroundColor,
        }}
      >
        {availability}
      </span>
      {!isInStock && (
        <Tooltip text="Узнать подробности о наличии товара">
          <button
            className="card-availability__button cursor-pointer w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-gray-100"
            aria-label="Информация о наличии"
          >
            <Image
              src="/question.svg"
              alt="Вопрос"
              width={20}
              height={20}
            />
          </button>
        </Tooltip>
      )}
    </>
  );
}
