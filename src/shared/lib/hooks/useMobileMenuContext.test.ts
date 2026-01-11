import { renderHook, act } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { MobileMenuContext, useMobileMenuContext, type MobileMenuContextValue } from './useMobileMenuContext';

describe('useMobileMenuContext', () => {
  const createWrapper = (contextValue: MobileMenuContextValue) => {
    const Wrapper = ({ children }: { children: ReactNode }) =>
      React.createElement(
        MobileMenuContext.Provider,
        { value: contextValue },
        children
      );
    Wrapper.displayName = 'MobileMenuContextWrapper';
    return Wrapper;
  };

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useMobileMenuContext());
    }).toThrow('useMobileMenuContext must be used within MobileMenuProvider');

    consoleSpy.mockRestore();
  });

  it('should return context value when used inside provider', () => {
    const mockContextValue: MobileMenuContextValue = {
      isOpen: false,
      toggle: jest.fn(),
      open: jest.fn(),
      close: jest.fn(),
    };

    const wrapper = createWrapper(mockContextValue);
    const { result } = renderHook(() => useMobileMenuContext(), { wrapper });

    expect(result.current).toEqual(mockContextValue);
    expect(result.current.isOpen).toBe(false);
    expect(result.current.open).toBe(mockContextValue.open);
    expect(result.current.close).toBe(mockContextValue.close);
    expect(result.current.toggle).toBe(mockContextValue.toggle);
  });

  it('should return correct isOpen state', () => {
    const mockContextValue: MobileMenuContextValue = {
      isOpen: true,
      toggle: jest.fn(),
      open: jest.fn(),
      close: jest.fn(),
    };

    const wrapper = createWrapper(mockContextValue);
    const { result } = renderHook(() => useMobileMenuContext(), { wrapper });

    expect(result.current.isOpen).toBe(true);
  });

  it('should call toggle function from context', () => {
    const mockToggle = jest.fn();
    const mockContextValue: MobileMenuContextValue = {
      isOpen: false,
      toggle: mockToggle,
      open: jest.fn(),
      close: jest.fn(),
    };

    const wrapper = createWrapper(mockContextValue);
    const { result } = renderHook(() => useMobileMenuContext(), { wrapper });

    act(() => {
      result.current.toggle();
    });

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('should call open function from context', () => {
    const mockOpen = jest.fn();
    const mockContextValue: MobileMenuContextValue = {
      isOpen: false,
      toggle: jest.fn(),
      open: mockOpen,
      close: jest.fn(),
    };

    const wrapper = createWrapper(mockContextValue);
    const { result } = renderHook(() => useMobileMenuContext(), { wrapper });

    act(() => {
      result.current.open();
    });

    expect(mockOpen).toHaveBeenCalledTimes(1);
  });

  it('should call close function from context', () => {
    const mockClose = jest.fn();
    const mockContextValue: MobileMenuContextValue = {
      isOpen: true,
      toggle: jest.fn(),
      open: jest.fn(),
      close: mockClose,
    };

    const wrapper = createWrapper(mockContextValue);
    const { result } = renderHook(() => useMobileMenuContext(), { wrapper });

    act(() => {
      result.current.close();
    });

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should work with multiple hook calls', () => {
    const mockOpen = jest.fn();
    const mockClose = jest.fn();
    const mockToggle = jest.fn();
    const mockContextValue: MobileMenuContextValue = {
      isOpen: false,
      toggle: mockToggle,
      open: mockOpen,
      close: mockClose,
    };

    const wrapper = createWrapper(mockContextValue);
    const { result } = renderHook(() => useMobileMenuContext(), { wrapper });

    act(() => {
      result.current.open();
      result.current.close();
      result.current.toggle();
      result.current.open();
    });

    expect(mockOpen).toHaveBeenCalledTimes(2);
    expect(mockClose).toHaveBeenCalledTimes(1);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
