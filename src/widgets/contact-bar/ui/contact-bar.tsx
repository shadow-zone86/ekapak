import Image from 'next/image';
import { Card } from '@/shared/ui/card';
import { Description } from '@/shared/ui/typography';
import { cn } from '@/shared/lib/utils';
import { SocialLink } from '../model/types';
import { defaultSocialLinks } from '../config/defaultSocialLinks';

export interface ContactBarProps {
  address?: string;
  email?: string;
  phones?: string[];
  socialLinks?: SocialLink[];
  showOnMobile?: boolean;
}

export function ContactBar({
  address = 'г. Екатеринбург, ул. Старых Большевиков, 2А/2',
  email = 'info@ekapak.ru',
  phones = ['+7 (906) 813-97-77', '+7 (906) 813-63-33'],
  socialLinks = defaultSocialLinks,
  showOnMobile = false,
}: ContactBarProps) {
  return (
    <Card
      variant="outlined"
      className={cn('rounded-none border-x-0 border-t-0 p-0', {
        'hidden md:block': !showOnMobile,
      })}
    >
      <div className="px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          {/* Address */}
          <div className="flex items-center gap-2">
            <Image
              src="/location.svg"
              alt="Location"
              width={16}
              height={16}
              className="opacity-70"
              style={{ width: 'auto', height: 'auto' }}
            />
            <Description className="text-black text-[14px]">
              {address}
            </Description>
          </div>

          <div className="flex flex-wrap items-center">
            {/* Email */}
            <div className="flex items-center gap-2">
              <Image
                src="/mail.svg"
                alt="Email"
                width={16}
                height={16}
                className="opacity-70"
              />
              <Description className="text-black text-[14px]">
                {email}
              </Description>
            </div>

            {/* Social links - 16px отступ от Email */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4 ml-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <Image
                      src={link.icon}
                      alt={link.alt}
                      width={20}
                      height={20}
                      className="opacity-70"
                    />
                  </a>
                ))}
              </div>
            )}

            {/* Phones - 30px отступ от Social links */}
            {phones.length > 0 && (
              <div className="flex items-center gap-5 font-bold ml-[30px]">
                {phones.map((phone, index) => (
                  <Description key={index} className="text-black">
                    {phone}
                  </Description>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
