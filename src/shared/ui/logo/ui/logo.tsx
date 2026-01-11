import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

export interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn('logo', 'flex items-center gap-2 flex-shrink-0', className)}>
      <Image
        src="/logo.svg"
        alt="EKAPAK"
        width={153}
        height={19}
        className="logo__image h-5 w-auto"
      />
    </Link>
  );
}
