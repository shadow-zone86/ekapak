import Image from 'next/image';
import { Card } from '@/shared/ui/card';
import { H2, H3, Description } from '@/shared/ui/typography';
import { PromoBannerProps } from '../model/types';
import { defaultPromoBannerProps } from '../config/defaults';

export function PromoBanner({
  headline = defaultPromoBannerProps.headline,
  subtitle = defaultPromoBannerProps.subtitle,
  icon = defaultPromoBannerProps.icon,
  iconAlt = defaultPromoBannerProps.iconAlt,
}: PromoBannerProps) {
  return (
    <Card className="bg-white rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between gap-3 md:gap-6">
        {/* Text content */}
        <div className="flex-1">
          {/* Mobile: H3, Desktop: H2 */}
          <H3 className="text-black mb-1 md:hidden">
            {headline}
          </H3>
          <H2 className="text-black mb-2 hidden md:block">
            {headline}
          </H2>
          {subtitle && (
            <Description className="text-black text-xs md:text-sm">
              {subtitle}
            </Description>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <div className="flex-shrink-0">
            <Image
              src={icon}
              alt={iconAlt || 'Icon'}
              width={80}
              height={80}
              className="w-14 h-14 md:w-20 md:h-20"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
