import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { usePagination } from '../hooks/usePagination';
import * as api from '../services/api';
import { mockItem, mockItems } from './mocks/mockData';
import type { ReactNode } from 'react';

vi.mock('../services/api');

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('usePagination', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(api.getAllData).mockResolvedValue({
      results: mockItems,
      count: 40,
    });
    vi.mocked(api.getData).mockResolvedValue(mockItem);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('starts with loading true and empty items', () => {
    const { result } = renderHook(() => usePagination(''), { wrapper });
    expect(result.current.loading).toBe(true);
    expect(result.current.items).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('fetches all items when searchTerm is empty', async () => {
    const { result } = renderHook(() => usePagination(''), { wrapper });
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(api.getAllData).toHaveBeenCalledWith(0, 20);
    expect(result.current.items).toEqual(mockItems);
    expect(result.current.loading).toBe(false);
  });

  it('fetches single item when searchTerm is provided', async () => {
    const { result } = renderHook(() => usePagination('bulbasaur'), {
      wrapper,
    });
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(api.getData).toHaveBeenCalledWith('bulbasaur');
    expect(result.current.items).toEqual([mockItem]);
    expect(result.current.loading).toBe(false);
  });

  it('sets error state when API throws', async () => {
    vi.mocked(api.getAllData).mockRejectedValue(
      new Error('Server error. Please try again later')
    );
    const { result } = renderHook(() => usePagination(''), { wrapper });
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(result.current.error).toBe('Server error. Please try again later');
    expect(result.current.items).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('calculates totalPages from count', async () => {
    const { result } = renderHook(() => usePagination(''), { wrapper });
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(result.current.totalPages).toBe(2);
  });

  it('resets to page 1 when searchTerm changes', async () => {
    const { result, rerender } = renderHook(
      ({ term }: { term: string }) => usePagination(term),
      { wrapper, initialProps: { term: '' } }
    );
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    act(() => {
      result.current.goToPage(2);
    });
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(result.current.currentPage).toBe(2);

    rerender({ term: 'bulbasaur' });
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(result.current.currentPage).toBe(1);
  });

  it('nextPage increments currentPage', async () => {
    const { result } = renderHook(() => usePagination(''), { wrapper });
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    act(() => {
      result.current.nextPage();
    });
    expect(result.current.currentPage).toBe(2);
  });

  it('prevPage does not go below page 1', async () => {
    const { result } = renderHook(() => usePagination(''), { wrapper });
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    act(() => {
      result.current.prevPage();
    });
    expect(result.current.currentPage).toBe(1);
  });

  it('clears error on new fetch', async () => {
    vi.mocked(api.getData).mockRejectedValueOnce(
      new Error('Pokemon not found. Please check the name')
    );
    const { result, rerender } = renderHook(
      ({ term }: { term: string }) => usePagination(term),
      { wrapper, initialProps: { term: 'badterm' } }
    );
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(result.current.error).toBe(
      'Pokemon not found. Please check the name'
    );

    vi.mocked(api.getData).mockResolvedValue(mockItem);
    rerender({ term: 'bulbasaur' });
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(result.current.error).toBeNull();
  });
});
