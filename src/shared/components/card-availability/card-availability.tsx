import Image from 'next/image';
import { Tooltip } from '@/shared/ui/tooltip';

interface CardAvailabilityProps {
  availability: string;
  availabilityColor: string;
  isInStock: boolean;
}

export function CardAvailability({ availability, availabilityColor, isInStock }: CardAvailabilityProps) {
  return (
    <>
      <span className="text-description text-xs" style={{ color: availabilityColor }}>
        {availability}
      </span>
      {!isInStock && (
        <Tooltip text="Узнать подробности о наличии товара">
          <button
            className="cursor-pointer w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-gray-100"
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
