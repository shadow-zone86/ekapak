import Image from 'next/image';
import { Card } from '@/shared/ui/card';
import { H2, H3, Description } from '@/shared/ui/typography';
import { PromoBannerProps } from '../model/types';
import { defaultPromoBannerProps } from '../config/defaults';
import { ScrollAnimateWrapper } from '@/shared/components/scroll-animate-wrapper';

export function PromoBanner({
  headline = defaultPromoBannerProps.headline,
  subtitle = defaultPromoBannerProps.subtitle,
  icon = defaultPromoBannerProps.icon,
  iconAlt = defaultPromoBannerProps.iconAlt,
}: PromoBannerProps) {
  return (
    <ScrollAnimateWrapper>
      <Card className="promo-banner bg-white rounded-lg p-4 md:p-6 mt-[50px]">
      <div className="promo-banner__container flex items-center justify-between gap-3 md:gap-6">
        {/* Text content */}
        <div className="promo-banner__content flex-1">
          {/* Mobile: H3, Desktop: H2 */}
          <H3 className="promo-banner__headline promo-banner__headline--mobile text-black mb-1 md:hidden">
            {headline}
          </H3>
          <H2 className="promo-banner__headline promo-banner__headline--desktop text-black mb-2 hidden md:block">
            {headline}
          </H2>
          {subtitle && (
            <Description className="promo-banner__subtitle text-black text-xs md:text-sm">
              {subtitle}
            </Description>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <div className="promo-banner__icon flex-shrink-0">
            <Image
              src={icon}
              alt={iconAlt || 'Icon'}
              width={80}
              height={80}
              className="promo-banner__icon-image w-14 h-14 md:w-20 md:h-20"
            />
          </div>
        )}
      </div>
    </Card>
    </ScrollAnimateWrapper>
  );
}
