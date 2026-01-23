import { renderHook, act } from '@testing-library/react';
import { useAppDispatch, useAppSelector } from '@/shared/config/store-hooks';
import { toggleFavorite } from '@/entities/favorites/model/store/favoritesState';
import { useToggleFavorite } from './useToggleFavorite';

// Мокаем Redux hooks
jest.mock('@/shared/config/store-hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

// Мокаем favorites slice actions
jest.mock('@/entities/favorites/model/store/favoritesState', () => ({
  toggleFavorite: jest.fn((payload) => ({ type: 'favorites/toggleFavorite', payload })),
}));

// Мокаем NotificationProvider
jest.mock('@/shared/ui/notification-provider/ui/notification-provider', () => ({
  useNotificationContext: jest.fn(() => ({
    addNotification: jest.fn(),
    removeNotification: jest.fn(),
    clearNotifications: jest.fn(),
  })),
}));

describe('useToggleFavorite', () => {
  const mockDispatch = jest.fn();
  const productUuid = 'product-123';

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('should return isFavorite as false when product is not in favorites', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      const state = {
        favorites: {
          productUuids: ['product-456', 'product-789'],
        },
      };
      return selector(state);
    });

    const { result } = renderHook(() => useToggleFavorite({ productUuid }));

    expect(result.current.isFavorite).toBe(false);
    expect(typeof result.current.toggleFavorite).toBe('function');
  });

  it('should return isFavorite as true when product is in favorites', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      const state = {
        favorites: {
          productUuids: ['product-123', 'product-456'],
        },
      };
      return selector(state);
    });

    const { result } = renderHook(() => useToggleFavorite({ productUuid }));

    expect(result.current.isFavorite).toBe(true);
  });

  it('should dispatch toggleFavorite action when toggleFavorite is called', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      const state = {
        favorites: {
          productUuids: [],
        },
      };
      return selector(state);
    });

    const { result } = renderHook(() => useToggleFavorite({ productUuid }));

    act(() => {
      result.current.toggleFavorite();
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(toggleFavorite).toHaveBeenCalledWith(productUuid);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'favorites/toggleFavorite',
      payload: productUuid,
    });
  });

  it('should handle toggleFavorite with different product UUIDs', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      const state = {
        favorites: {
          productUuids: [],
        },
      };
      return selector(state);
    });

    const { result: result1 } = renderHook(() => useToggleFavorite({ productUuid: 'product-1' }));

    act(() => {
      result1.current.toggleFavorite();
    });

    expect(toggleFavorite).toHaveBeenCalledWith('product-1');

    const { result: result2 } = renderHook(() => useToggleFavorite({ productUuid: 'product-2' }));

    act(() => {
      result2.current.toggleFavorite();
    });

    expect(toggleFavorite).toHaveBeenCalledWith('product-2');
  });

  it('should return correct isFavorite when product is in favorites list', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      const state = {
        favorites: {
          productUuids: ['product-456', 'product-123'],
        },
      };
      return selector(state);
    });

    const { result } = renderHook(() => useToggleFavorite({ productUuid }));

    expect(result.current.isFavorite).toBe(true);
  });

  it('should handle multiple toggleFavorite calls', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      const state = {
        favorites: {
          productUuids: [],
        },
      };
      return selector(state);
    });

    const { result } = renderHook(() => useToggleFavorite({ productUuid }));

    act(() => {
      result.current.toggleFavorite();
    });

    act(() => {
      result.current.toggleFavorite();
    });

    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(toggleFavorite).toHaveBeenCalledTimes(2);
    expect(toggleFavorite).toHaveBeenNthCalledWith(1, productUuid);
    expect(toggleFavorite).toHaveBeenNthCalledWith(2, productUuid);
  });

  it('should handle empty favorites list', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      const state = {
        favorites: {
          productUuids: [],
        },
      };
      return selector(state);
    });

    const { result } = renderHook(() => useToggleFavorite({ productUuid }));

    expect(result.current.isFavorite).toBe(false);

    act(() => {
      result.current.toggleFavorite();
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(toggleFavorite).toHaveBeenCalledWith(productUuid);
  });

  it('should handle product UUID with special characters', () => {
    const specialUuid = 'product-123-abc-def-456';
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      const state = {
        favorites: {
          productUuids: [specialUuid],
        },
      };
      return selector(state);
    });

    const { result } = renderHook(() => useToggleFavorite({ productUuid: specialUuid }));

    expect(result.current.isFavorite).toBe(true);

    act(() => {
      result.current.toggleFavorite();
    });

    expect(toggleFavorite).toHaveBeenCalledWith(specialUuid);
  });
});
