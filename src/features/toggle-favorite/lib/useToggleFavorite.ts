import { useAppDispatch, useAppSelector } from '@/shared/config/store-hooks';
import { toggleFavorite } from '@/entities/favorites/model/favoritesState';
import { useNotificationContext } from '@/shared/ui/notification-provider';

interface UseToggleFavoriteProps {
  productUuid: string;
  productName?: string;
}

export function useToggleFavorite({ productUuid, productName }: UseToggleFavoriteProps) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(
    (state) => state.favorites.productUuids.includes(productUuid)
  );
  const { addNotification } = useNotificationContext();

  const handleToggle = () => {
    const wasFavorite = isFavorite;
    dispatch(toggleFavorite(productUuid));

    if (wasFavorite) {
      addNotification({
        type: 'info',
        message: productName 
          ? `Товар "${productName}" удален из избранного`
          : 'Товар удален из избранного',
        duration: 3000,
      });
    } else {
      addNotification({
        type: 'success',
        message: productName 
          ? `Товар "${productName}" добавлен в избранное`
          : 'Товар добавлен в избранное',
        duration: 3000,
      });
    }
  };

  return {
    isFavorite,
    toggleFavorite: handleToggle,
  };
}
