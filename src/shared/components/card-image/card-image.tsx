'use client';

import Image from 'next/image';

interface CardImageProps {
  image?: string;
  alt: string;
}

export function CardImage({ image, alt }: CardImageProps) {
  if (!image) {
    return (
      <div className="flex h-full items-center justify-center text-gray text-sm">
        Нет изображения
      </div>
    );
  }
  return (
    <Image
      src={image}
      alt={alt}
      fill
      className="object-contain p-3 transition-transform group-hover:scale-105"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      unoptimized
    />
  );
}
