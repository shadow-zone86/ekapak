import { renderHook, act } from '@testing-library/react';
import { useProductSearch } from './useProductSearch';

describe('useProductSearch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should return initial empty search query', () => {
    const { result } = renderHook(() => useProductSearch());

    expect(result.current.searchQuery).toBe('');
    expect(typeof result.current.handleSearchChange).toBe('function');
  });

  it('should update search query immediately', () => {
    const { result } = renderHook(() => useProductSearch());

    act(() => {
      result.current.handleSearchChange('test query');
    });

    expect(result.current.searchQuery).toBe('test query');
  });

  it('should call onSearch callback after debounce delay', () => {
    const onSearch = jest.fn();
    const { result } = renderHook(() =>
      useProductSearch({ debounceMs: 300, onSearch })
    );

    act(() => {
      result.current.handleSearchChange('test');
    });

    expect(onSearch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onSearch).toHaveBeenCalledWith('test');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('should debounce multiple rapid changes', () => {
    const onSearch = jest.fn();
    const { result } = renderHook(() =>
      useProductSearch({ debounceMs: 300, onSearch })
    );

    act(() => {
      result.current.handleSearchChange('t');
      result.current.handleSearchChange('te');
      result.current.handleSearchChange('tes');
      result.current.handleSearchChange('test');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('test');
  });

  it('should reset debounce timer on new input', () => {
    const onSearch = jest.fn();
    const { result } = renderHook(() =>
      useProductSearch({ debounceMs: 300, onSearch })
    );

    act(() => {
      result.current.handleSearchChange('test');
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    // At this point, onSearch should not be called yet (only 200ms passed)
    expect(onSearch).not.toHaveBeenCalled();

    act(() => {
      result.current.handleSearchChange('test2');
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Still not called (only 200ms since last change)
    expect(onSearch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Now it should be called with 'test2' (300ms since last change)
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('test2');
  });

  it('should use default debounce delay if not provided', () => {
    const onSearch = jest.fn();
    const { result } = renderHook(() =>
      useProductSearch({ onSearch })
    );

    act(() => {
      result.current.handleSearchChange('test');
    });

    expect(onSearch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300); // default delay
    });

    expect(onSearch).toHaveBeenCalledWith('test');
  });

  it('should work without onSearch callback', () => {
    const { result } = renderHook(() => useProductSearch());

    act(() => {
      result.current.handleSearchChange('test');
    });

    expect(result.current.searchQuery).toBe('test');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should not throw error
    expect(result.current.searchQuery).toBe('test');
  });

  it('should handle empty string', () => {
    const onSearch = jest.fn();
    const { result } = renderHook(() =>
      useProductSearch({ onSearch })
    );

    act(() => {
      result.current.handleSearchChange('');
    });

    expect(result.current.searchQuery).toBe('');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onSearch).toHaveBeenCalledWith('');
  });
});
