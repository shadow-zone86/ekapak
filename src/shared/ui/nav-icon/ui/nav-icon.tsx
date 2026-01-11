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
      <Image src={icon} alt={label} width={iconSize} height={iconSize} className="opacity-70" />
      <Description className="text-black text-xs">{label}</Description>
      {badge && (
        <span className="absolute -top-1 -right-1 rounded-full bg-blue-600 text-white text-xs px-1.5 py-0.5 min-w-[20px] text-center">
          {badge}
        </span>
      )}
    </>
  );

  const baseClasses =
    'flex flex-col items-center gap-1 hover:opacity-70 transition-opacity relative cursor-pointer';

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
