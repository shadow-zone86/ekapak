import { renderHook, act } from '@testing-library/react';
import { useProductQuantity } from './useProductQuantity';

describe('useProductQuantity', () => {
  const defaultProps = {
    minPurchase: 100,
    price: 50.0,
    unit: 'шт.',
    currency: '₽',
  };

  it('should initialize with minPurchase quantity', () => {
    const { result } = renderHook(() => useProductQuantity(defaultProps));

    expect(result.current.quantity).toBe(100);
    expect(result.current.totalPrice).toBe(5000.0); // 100 * 50
    expect(result.current.unit).toBe('шт.');
    expect(result.current.currency).toBe('₽');
  });

  it('should calculate totalPrice correctly', () => {
    const { result } = renderHook(() =>
      useProductQuantity({
        ...defaultProps,
        minPurchase: 5,
        price: 10.5,
      })
    );

    expect(result.current.quantity).toBe(5);
    expect(result.current.totalPrice).toBe(52.5); // 5 * 10.5
  });

  it('should increase quantity when handleIncrease is called', () => {
    const { result } = renderHook(() => useProductQuantity(defaultProps));

    expect(result.current.quantity).toBe(100);

    act(() => {
      result.current.handleIncrease();
    });

    expect(result.current.quantity).toBe(101);
    expect(result.current.totalPrice).toBe(5050.0); // 101 * 50
  });

  it('should decrease quantity when handleDecrease is called', () => {
    const { result } = renderHook(() =>
      useProductQuantity({
        ...defaultProps,
        minPurchase: 50,
      })
    );

    expect(result.current.quantity).toBe(50);

    // First increase to allow decrease
    act(() => {
      result.current.handleIncrease();
    });

    expect(result.current.quantity).toBe(51);

    // Now decrease
    act(() => {
      result.current.handleDecrease();
    });

    expect(result.current.quantity).toBe(50);
    expect(result.current.totalPrice).toBe(2500.0); // 50 * 50
  });

  it('should not decrease quantity below minPurchase', () => {
    const { result } = renderHook(() =>
      useProductQuantity({
        ...defaultProps,
        minPurchase: 5,
      })
    );

    expect(result.current.quantity).toBe(5);

    act(() => {
      result.current.handleDecrease();
    });

    expect(result.current.quantity).toBe(5); // Should not go below minPurchase
  });

  it('should update totalPrice when quantity changes', () => {
    const { result } = renderHook(() =>
      useProductQuantity({
        ...defaultProps,
        minPurchase: 10,
        price: 25.0,
      })
    );

    expect(result.current.quantity).toBe(10);
    expect(result.current.totalPrice).toBe(250.0);

    act(() => {
      result.current.handleIncrease();
      result.current.handleIncrease();
    });

    expect(result.current.quantity).toBe(12);
    expect(result.current.totalPrice).toBe(300.0); // 12 * 25
  });

  it('should handle multiple increase and decrease operations', () => {
    const { result } = renderHook(() =>
      useProductQuantity({
        ...defaultProps,
        minPurchase: 1,
        price: 10.0,
      })
    );

    act(() => {
      result.current.handleIncrease();
      result.current.handleIncrease();
      result.current.handleIncrease();
    });

    expect(result.current.quantity).toBe(4);
    expect(result.current.totalPrice).toBe(40.0);

    act(() => {
      result.current.handleDecrease();
      result.current.handleDecrease();
    });

    expect(result.current.quantity).toBe(2);
    expect(result.current.totalPrice).toBe(20.0);
  });

  it('should recalculate totalPrice when price changes', () => {
    const { result, rerender } = renderHook(
      (props) => useProductQuantity(props),
      {
        initialProps: {
          ...defaultProps,
          price: 10.0,
        },
      }
    );

    expect(result.current.totalPrice).toBe(1000.0); // 100 * 10

    rerender({
      ...defaultProps,
      price: 20.0,
    });

    expect(result.current.totalPrice).toBe(2000.0); // 100 * 20
  });
});
