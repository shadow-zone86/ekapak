import { renderHook, act } from '@testing-library/react';
import { useAddToCart } from './useAddToCart';
import { useAppDispatch, useAppSelector } from '@/shared/config/store-hooks';
import { addItem, updateQuantity } from '@/entities/cart/model/cartState';
import type { IProductUiDto } from '@/entities/product/model/dto/types';

// Мокаем Redux hooks
jest.mock('@/shared/config/store-hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

// Мокаем cart slice actions
jest.mock('@/entities/cart/model/cartState', () => ({
  addItem: jest.fn((payload) => ({ type: 'cart/addItem', payload })),
  updateQuantity: jest.fn((payload) => ({ type: 'cart/updateQuantity', payload })),
}));

// Мокаем NotificationProvider
jest.mock('@/shared/ui/notification-provider/ui/notification-provider', () => ({
  useNotificationContext: jest.fn(() => ({
    addNotification: jest.fn(),
    removeNotification: jest.fn(),
    clearNotifications: jest.fn(),
  })),
}));

describe('useAddToCart', () => {
  const mockDispatch = jest.fn();
  const mockCartItems: Array<{
    id: string;
    productUuid: string;
    offerUuid: string;
    quantity: number;
  }> = [];

  const mockProduct: IProductUiDto = {
    uuid: 'product-123',
    name: 'Test Product',
    sku: 'SKU-123',
    slug: 'test-product',
    isInStock: true,
    availability: 'В наличии',
    availabilityColor: '#2AC84D',
    hasMultipleOffers: false,
    offers: [],
    defaultOffer: {
      uuid: 'offer-123',
      name: 'Test Offer',
      price: 100,
      currency: 'RUB',
      currencySymbol: '₽',
      formattedPrice: '100.00 ₽',
      unit: 'шт.',
      quantity: 10,
      minPurchase: 10,
      isAvailable: true,
      priceType: 'regular',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      const state = { cart: { items: mockCartItems } };
      return selector(state);
    });
    mockCartItems.length = 0;
  });

  describe('isDisabled', () => {
    it('should be false when product has valid offer and is in stock', () => {
      const { result } = renderHook(() =>
        useAddToCart({ product: mockProduct, quantity: 10 })
      );

      expect(result.current.isDisabled).toBe(false);
    });

    it('should be true when product is not in stock', () => {
      const productOutOfStock: IProductUiDto = {
        ...mockProduct,
        isInStock: false,
        availability: 'Под заказ',
        availabilityColor: '#00B0FF',
      };

      const { result } = renderHook(() =>
        useAddToCart({ product: productOutOfStock, quantity: 10 })
      );

      expect(result.current.isDisabled).toBe(true);
    });

    it('should be true when product has no defaultOffer', () => {
      const productNoOffer: IProductUiDto = {
        ...mockProduct,
        defaultOffer: undefined,
      };

      const { result } = renderHook(() =>
        useAddToCart({ product: productNoOffer, quantity: 10 })
      );

      expect(result.current.isDisabled).toBe(true);
    });

    it('should be true when price is NaN', () => {
      const productInvalidPrice: IProductUiDto = {
        ...mockProduct,
        defaultOffer: {
          ...mockProduct.defaultOffer!,
          price: NaN,
        },
      };

      const { result } = renderHook(() =>
        useAddToCart({ product: productInvalidPrice, quantity: 10 })
      );

      expect(result.current.isDisabled).toBe(true);
    });

    it('should be true when price is 0', () => {
      const productZeroPrice: IProductUiDto = {
        ...mockProduct,
        defaultOffer: {
          ...mockProduct.defaultOffer!,
          price: 0,
        },
      };

      const { result } = renderHook(() =>
        useAddToCart({ product: productZeroPrice, quantity: 10 })
      );

      expect(result.current.isDisabled).toBe(true);
    });
  });

  describe('handleAddToCart', () => {
    it('should add new item to cart when item does not exist', () => {
      const { result } = renderHook(() =>
        useAddToCart({ product: mockProduct, quantity: 5 })
      );

      act(() => {
        result.current.handleAddToCart();
      });

      // Должен вызвать addItem quantity раз (5 раз)
      expect(mockDispatch).toHaveBeenCalledTimes(5);
      expect(addItem).toHaveBeenCalledTimes(5);
      expect(addItem).toHaveBeenCalledWith({
        productUuid: 'product-123',
        productName: 'Test Product',
        productImage: null,
        offerUuid: 'offer-123',
        offerName: 'Test Product',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        article: 'SKU-123',
      });
    });

    it('should update quantity when item already exists in cart', () => {
      const existingItem = {
        id: 'cart-item-1',
        productUuid: 'product-123',
        offerUuid: 'offer-123',
        quantity: 3,
      };

      mockCartItems.push(existingItem);

      const { result } = renderHook(() =>
        useAddToCart({ product: mockProduct, quantity: 5 })
      );

      act(() => {
        result.current.handleAddToCart();
      });

      // Должен вызвать updateQuantity один раз
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(updateQuantity).toHaveBeenCalledWith({
        id: 'cart-item-1',
        quantity: 8, // 3 (existing) + 5 (new)
      });
      expect(addItem).not.toHaveBeenCalled();
    });

    it('should not dispatch when defaultOffer is missing', () => {
      const productNoOffer: IProductUiDto = {
        ...mockProduct,
        defaultOffer: undefined,
      };

      const { result } = renderHook(() =>
        useAddToCart({ product: productNoOffer, quantity: 5 })
      );

      act(() => {
        result.current.handleAddToCart();
      });

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(addItem).not.toHaveBeenCalled();
      expect(updateQuantity).not.toHaveBeenCalled();
    });

    it('should not dispatch when price is invalid', () => {
      const productInvalidPrice: IProductUiDto = {
        ...mockProduct,
        defaultOffer: {
          ...mockProduct.defaultOffer!,
          price: NaN,
        },
      };

      const { result } = renderHook(() =>
        useAddToCart({ product: productInvalidPrice, quantity: 5 })
      );

      act(() => {
        result.current.handleAddToCart();
      });

      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should handle product with image', () => {
      const productWithImage: IProductUiDto = {
        ...mockProduct,
        image: 'https://example.com/image.jpg',
      };

      const { result } = renderHook(() =>
        useAddToCart({ product: productWithImage, quantity: 2 })
      );

      act(() => {
        result.current.handleAddToCart();
      });

      expect(addItem).toHaveBeenCalledWith(
        expect.objectContaining({
          productImage: 'https://example.com/image.jpg',
        })
      );
    });

    it('should handle product without image', () => {
      const productWithoutImage: IProductUiDto = {
        ...mockProduct,
        image: undefined,
      };

      const { result } = renderHook(() =>
        useAddToCart({ product: productWithoutImage, quantity: 2 })
      );

      act(() => {
        result.current.handleAddToCart();
      });

      expect(addItem).toHaveBeenCalledWith(
        expect.objectContaining({
          productImage: null,
        })
      );
    });

    it('should handle product without sku', () => {
      const productNoSku: IProductUiDto = {
        ...mockProduct,
        sku: '',
      };

      const { result } = renderHook(() =>
        useAddToCart({ product: productNoSku, quantity: 2 })
      );

      act(() => {
        result.current.handleAddToCart();
      });

      expect(addItem).toHaveBeenCalledWith(
        expect.objectContaining({
          article: '',
        })
      );
    });

    it('should use default currency when not provided', () => {
      const productNoCurrency: IProductUiDto = {
        ...mockProduct,
        defaultOffer: {
          ...mockProduct.defaultOffer!,
          currency: undefined as unknown as string,
        },
      };

      const { result } = renderHook(() =>
        useAddToCart({ product: productNoCurrency, quantity: 2 })
      );

      act(() => {
        result.current.handleAddToCart();
      });

      expect(addItem).toHaveBeenCalledWith(
        expect.objectContaining({
          currency: 'RUB',
        })
      );
    });

    it('should handle quantity of 1', () => {
      const { result } = renderHook(() =>
        useAddToCart({ product: mockProduct, quantity: 1 })
      );

      act(() => {
        result.current.handleAddToCart();
      });

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(addItem).toHaveBeenCalledTimes(1);
    });

    it('should handle large quantity', () => {
      const { result } = renderHook(() =>
        useAddToCart({ product: mockProduct, quantity: 100 })
      );

      act(() => {
        result.current.handleAddToCart();
      });

      expect(mockDispatch).toHaveBeenCalledTimes(100);
      expect(addItem).toHaveBeenCalledTimes(100);
    });
  });
});
