import Link from 'next/link';
import Image from 'next/image';
import { Description } from '@/shared/ui/typography';
import { cn } from '@/shared/lib/utils';

export interface NavIconProps {
  icon: string;
  label: string;
  href?: string;
  onClick?: () => void;
  badge?: number | string;
  className?: string;
  iconSize?: number;
}

export function NavIcon({
  icon,
  label,
  href,
  onClick,
  badge,
  className,
  iconSize = 24,
}: NavIconProps) {
  const content = (
    <>
      <Image src={icon} alt={label} width={iconSize} height={iconSize} className="nav-icon__icon opacity-70" />
      <Description className="nav-icon__label text-black text-xs">{label}</Description>
      {badge && (
        <span className="nav-icon__badge absolute -top-1 -right-1 rounded-full bg-blue-600 text-white text-xs px-1.5 py-0.5 min-w-[20px] text-center">
          {badge}
        </span>
      )}
    </>
  );

  const baseClasses =
    'nav-icon flex flex-col items-center gap-1 hover:opacity-70 transition-smooth relative cursor-pointer active:scale-95';

  if (href) {
    return (
      <Link href={href} className={cn(baseClasses, className)}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cn(baseClasses, className)}>
      {content}
    </button>
  );
}
