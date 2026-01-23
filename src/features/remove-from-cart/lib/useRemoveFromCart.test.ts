import { renderHook, act } from '@testing-library/react';
import { useRemoveFromCart } from './useRemoveFromCart';
import { useAppDispatch } from '@/shared/config/store-hooks';
import { removeItem } from '@/entities/cart/model/store/cartState';

jest.mock('@/shared/config/store-hooks');
jest.mock('@/entities/cart/model/store/cartState', () => ({
  removeItem: jest.fn(),
}));

const mockDispatch = jest.fn();
const mockRemoveItem = removeItem as jest.MockedFunction<typeof removeItem>;

describe('useRemoveFromCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('should return handleRemove function', () => {
    const { result } = renderHook(() =>
      useRemoveFromCart({ cartItemId: 'test-id' })
    );

    expect(result.current.handleRemove).toBeDefined();
    expect(typeof result.current.handleRemove).toBe('function');
  });

  it('should dispatch removeItem action when handleRemove is called', () => {
    const cartItemId = 'test-cart-item-id';
    const { result } = renderHook(() =>
      useRemoveFromCart({ cartItemId })
    );

    act(() => {
      result.current.handleRemove();
    });

    expect(mockRemoveItem).toHaveBeenCalledWith(cartItemId);
    expect(mockDispatch).toHaveBeenCalledWith(mockRemoveItem(cartItemId));
  });

  it('should dispatch removeItem with correct cartItemId', () => {
    const cartItemId = 'another-item-id';
    const { result } = renderHook(() =>
      useRemoveFromCart({ cartItemId })
    );

    act(() => {
      result.current.handleRemove();
    });

    expect(mockRemoveItem).toHaveBeenCalledWith(cartItemId);
  });

  it('should call dispatch only once when handleRemove is called once', () => {
    const { result } = renderHook(() =>
      useRemoveFromCart({ cartItemId: 'test-id' })
    );

    act(() => {
      result.current.handleRemove();
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockRemoveItem).toHaveBeenCalledTimes(1);
  });

  it('should call dispatch multiple times when handleRemove is called multiple times', () => {
    const cartItemId = 'test-id';
    const { result } = renderHook(() =>
      useRemoveFromCart({ cartItemId })
    );

    act(() => {
      result.current.handleRemove();
      result.current.handleRemove();
      result.current.handleRemove();
    });

    expect(mockRemoveItem).toHaveBeenCalledTimes(3);
    expect(mockDispatch).toHaveBeenCalledTimes(3);
  });
});
