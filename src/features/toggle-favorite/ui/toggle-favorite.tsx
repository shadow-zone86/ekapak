'use client';

import Image from 'next/image';
import { useToggleFavorite } from '../lib/useToggleFavorite';

interface FavoriteButtonProps {
  productUuid: string;
  productName?: string;
  variant?: 'default' | 'compact';
}

export function FavoriteButton({ productUuid, productName, variant = 'default' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useToggleFavorite({ productUuid, productName });

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleFavorite}
        className="cursor-pointer flex h-6 w-6 items-center justify-center rounded border border-gray-300 bg-white text-gray-400 hover:bg-gray-100 hover:text-red-500"
        aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
      >
        <Image
          src="/favorites.svg"
          alt={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          width={18}
          height={18}
          className={isFavorite ? 'opacity-100' : 'opacity-70'}
          style={isFavorite ? { filter: 'brightness(0) saturate(100%) invert(26%) sepia(96%) saturate(7498%) hue-rotate(346deg) brightness(99%) contrast(97%)' } : undefined}
        />
      </button>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      className="cursor-pointer p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
      aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <Image
        src="/favorites.svg"
        alt={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        width={18}
        height={18}
        className={isFavorite ? 'opacity-100' : 'opacity-70'}
        style={isFavorite ? { filter: 'brightness(0) saturate(100%) invert(26%) sepia(96%) saturate(7498%) hue-rotate(346deg) brightness(99%) contrast(97%)' } : undefined}
      />
    </button>
  );
}
