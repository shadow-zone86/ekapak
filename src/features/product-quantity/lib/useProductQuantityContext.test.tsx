import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ProductQuantityProvider, useProductQuantityContext } from './useProductQuantityContext';

describe('useProductQuantityContext', () => {
  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useProductQuantityContext());
    }).toThrow('useProductQuantityContext must be used within ProductQuantityProvider');

    consoleSpy.mockRestore();
  });

  it('should provide initial quantity from provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ProductQuantityProvider initialQuantity={100}>
        {children}
      </ProductQuantityProvider>
    );

    const { result } = renderHook(() => useProductQuantityContext(), {
      wrapper,
    });

    expect(result.current.quantity).toBe(100);
    expect(typeof result.current.setQuantity).toBe('function');
  });

  it('should update quantity when setQuantity is called', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ProductQuantityProvider initialQuantity={50}>
        {children}
      </ProductQuantityProvider>
    );

    const { result } = renderHook(() => useProductQuantityContext(), {
      wrapper,
    });

    expect(result.current.quantity).toBe(50);

    act(() => {
      result.current.setQuantity(75);
    });

    expect(result.current.quantity).toBe(75);
  });

  it('should handle multiple setQuantity calls', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ProductQuantityProvider initialQuantity={10}>
        {children}
      </ProductQuantityProvider>
    );

    const { result } = renderHook(() => useProductQuantityContext(), {
      wrapper,
    });

    act(() => {
      result.current.setQuantity(20);
      result.current.setQuantity(30);
      result.current.setQuantity(40);
    });

    expect(result.current.quantity).toBe(40);
  });

  it('should allow setting quantity to zero', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ProductQuantityProvider initialQuantity={100}>
        {children}
      </ProductQuantityProvider>
    );

    const { result } = renderHook(() => useProductQuantityContext(), {
      wrapper,
    });

    act(() => {
      result.current.setQuantity(0);
    });

    expect(result.current.quantity).toBe(0);
  });

  it('should maintain separate state for multiple providers', () => {
    const wrapper1 = ({ children }: { children: React.ReactNode }) => (
      <ProductQuantityProvider initialQuantity={10}>
        {children}
      </ProductQuantityProvider>
    );

    const wrapper2 = ({ children }: { children: React.ReactNode }) => (
      <ProductQuantityProvider initialQuantity={20}>
        {children}
      </ProductQuantityProvider>
    );

    const { result: result1 } = renderHook(() => useProductQuantityContext(), {
      wrapper: wrapper1,
    });

    const { result: result2 } = renderHook(() => useProductQuantityContext(), {
      wrapper: wrapper2,
    });

    expect(result1.current.quantity).toBe(10);
    expect(result2.current.quantity).toBe(20);

    act(() => {
      result1.current.setQuantity(15);
    });

    expect(result1.current.quantity).toBe(15);
    expect(result2.current.quantity).toBe(20); // Should remain unchanged
  });

  it('should handle different initial quantities', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ProductQuantityProvider initialQuantity={0}>
        {children}
      </ProductQuantityProvider>
    );

    const { result } = renderHook(() => useProductQuantityContext(), {
      wrapper,
    });

    expect(result.current.quantity).toBe(0);

    act(() => {
      result.current.setQuantity(100);
    });

    expect(result.current.quantity).toBe(100);
  });
});
