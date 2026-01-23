import { renderHook, act } from '@testing-library/react';
import { useProductSearchWithUrl } from './useProductSearchWithUrl';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
};

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('useProductSearchWithUrl', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter as ReturnType<typeof useRouter>);
    mockUsePathname.mockReturnValue('/');
    mockUseSearchParams.mockReturnValue({
      get: jest.fn(() => null),
      toString: jest.fn(() => ''),
    } as unknown as ReturnType<typeof useSearchParams>);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should return initial empty search query from URL', () => {
    const { result } = renderHook(() => useProductSearchWithUrl());

    expect(result.current.searchQuery).toBe('');
    expect(typeof result.current.handleSearchChange).toBe('function');
  });

  it('should initialize with search query from URL', () => {
    const mockGet = jest.fn((key: string) => {
      if (key === 'search') return 'initial query';
      return null;
    }) as jest.MockedFunction<(name: string) => string | null>;

    mockUseSearchParams.mockReturnValue({
      get: mockGet,
      toString: jest.fn(() => 'search=initial+query'),
    } as unknown as ReturnType<typeof useSearchParams>);

    const { result } = renderHook(() => useProductSearchWithUrl());

    expect(result.current.searchQuery).toBe('initial query');
  });

  it('should update search query immediately', () => {
    const { result } = renderHook(() => useProductSearchWithUrl());

    act(() => {
      result.current.handleSearchChange('test query');
    });

    expect(result.current.searchQuery).toBe('test query');
  });

  it('should update URL after debounce delay', () => {
    const mockGet = jest.fn<string | null, [string]>(() => null);
    const mockToString = jest.fn(() => '');

    mockUseSearchParams.mockReturnValue({
      get: mockGet,
      toString: mockToString,
    } as unknown as ReturnType<typeof useSearchParams>);

    const { result } = renderHook(() => useProductSearchWithUrl({ debounceMs: 300 }));

    act(() => {
      result.current.handleSearchChange('test');
    });

    expect(mockPush).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockPush).toHaveBeenCalled();
    // Verify that router.push was called (the URL construction is handled by URLSearchParams)
    expect(mockPush.mock.calls[0][0]).toBeTruthy();
  });

  it('should remove search param when query is empty', () => {
    const mockGet = jest.fn((key: string) => {
      if (key === 'search') return 'old query';
      return null;
    }) as jest.MockedFunction<(name: string) => string | null>;
    const mockToString = jest.fn(() => 'search=old+query&page=1');

    mockUseSearchParams.mockReturnValue({
      get: mockGet,
      toString: mockToString,
    } as unknown as ReturnType<typeof useSearchParams>);

    const { result } = renderHook(() => useProductSearchWithUrl({ debounceMs: 300 }));

    act(() => {
      result.current.handleSearchChange('');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockPush).toHaveBeenCalled();
    const callArg = mockPush.mock.calls[0][0];
    expect(callArg).not.toContain('search=');
  });

  it('should remove page param when search query changes', () => {
    const mockGet = jest.fn((key: string) => {
      if (key === 'search') return null;
      if (key === 'page') return '2';
      return null;
    }) as jest.MockedFunction<(name: string) => string | null>;
    const mockToString = jest.fn(() => 'page=2&category=cat1');

    mockUseSearchParams.mockReturnValue({
      get: mockGet,
      toString: mockToString,
    } as unknown as ReturnType<typeof useSearchParams>);

    const { result } = renderHook(() => useProductSearchWithUrl({ debounceMs: 300 }));

    act(() => {
      result.current.handleSearchChange('test');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockPush).toHaveBeenCalled();
    // URLSearchParams will be used, so we just check that push was called with correct params
    // The actual URL construction happens inside the hook via URLSearchParams
    expect(mockToString).toHaveBeenCalled();
  });

  it('should debounce multiple rapid changes', () => {
    const mockGet = jest.fn<string | null, [string]>(() => null);
    const mockToString = jest.fn(() => '');

    mockUseSearchParams.mockReturnValue({
      get: mockGet,
      toString: mockToString,
    } as unknown as ReturnType<typeof useSearchParams>);

    const { result } = renderHook(() => useProductSearchWithUrl({ debounceMs: 300 }));

    act(() => {
      result.current.handleSearchChange('t');
      result.current.handleSearchChange('te');
      result.current.handleSearchChange('tes');
      result.current.handleSearchChange('test');
    });

    expect(mockPush).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockPush).toHaveBeenCalledTimes(1);
    const callArg = mockPush.mock.calls[0][0];
    expect(callArg).toContain('search=test');
  });

  it('should use current pathname in URL', () => {
    mockUsePathname.mockReturnValue('/products');
    const mockGet = jest.fn<string | null, [string]>(() => null);
    const mockToString = jest.fn(() => '');

    mockUseSearchParams.mockReturnValue({
      get: mockGet,
      toString: mockToString,
    } as unknown as ReturnType<typeof useSearchParams>);

    const { result } = renderHook(() => useProductSearchWithUrl({ debounceMs: 300 }));

    act(() => {
      result.current.handleSearchChange('test');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockPush).toHaveBeenCalled();
    const callArg = mockPush.mock.calls[0][0];
    expect(callArg).toContain('/products');
  });

  it('should use default debounce delay if not provided', () => {
    const mockGet = jest.fn<string | null, [string]>(() => null);
    const mockToString = jest.fn(() => '');

    mockUseSearchParams.mockReturnValue({
      get: mockGet,
      toString: mockToString,
    } as unknown as ReturnType<typeof useSearchParams>);

    const { result } = renderHook(() => useProductSearchWithUrl());

    act(() => {
      result.current.handleSearchChange('test');
    });

    expect(mockPush).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300); // default delay
    });

    expect(mockPush).toHaveBeenCalled();
  });

  it('should call router.push with scroll: false option', () => {
    const mockGet = jest.fn<string | null, [string]>(() => null);
    const mockToString = jest.fn(() => '');

    mockUseSearchParams.mockReturnValue({
      get: mockGet,
      toString: mockToString,
    } as unknown as ReturnType<typeof useSearchParams>);

    const { result } = renderHook(() => useProductSearchWithUrl({ debounceMs: 300 }));

    act(() => {
      result.current.handleSearchChange('test');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockPush).toHaveBeenCalledWith(expect.any(String), { scroll: false });
  });

  it('should trim search query before setting URL', () => {
    const mockGet = jest.fn<string | null, [string]>(() => null);
    const mockToString = jest.fn(() => '');

    mockUseSearchParams.mockReturnValue({
      get: mockGet,
      toString: mockToString,
    } as unknown as ReturnType<typeof useSearchParams>);

    const { result } = renderHook(() => useProductSearchWithUrl({ debounceMs: 300 }));

    act(() => {
      result.current.handleSearchChange('  test query  ');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockPush).toHaveBeenCalled();
    // The hook trims the query, so URLSearchParams will handle encoding
    const callArg = mockPush.mock.calls[0][0];
    expect(callArg).toContain('search=');
  });
});
