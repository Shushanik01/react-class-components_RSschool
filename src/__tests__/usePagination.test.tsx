import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { usePagination } from '../hooks/usePagination';
import { pokemonApi } from '../api/api';
import { mockItem, mockItems } from './mocks/mockData';
import type { ReactNode } from 'react';

const mockDispatch = vi.hoisted(() => vi.fn());

vi.mock('../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock('../api/api', () => ({
  pokemonApi: {
    endpoints: {
      getSinglePokemon: { initiate: vi.fn() },
      getAllPokemons: { initiate: vi.fn() },
    },
  },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('usePagination', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    mockDispatch.mockImplementation(async (action: unknown) => {
      if (typeof action === 'function') return (action as Function)(mockDispatch);
      return action;
    });

    vi.mocked(pokemonApi.endpoints.getAllPokemons.initiate).mockReturnValue(
      (() => Promise.resolve({ data: { results: mockItems, count: 40 } })) as never
    );
    vi.mocked(pokemonApi.endpoints.getSinglePokemon.initiate).mockReturnValue(
      (() => Promise.resolve({ data: mockItem })) as never
    );
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
    expect(pokemonApi.endpoints.getAllPokemons.initiate).toHaveBeenCalledWith({
      offset: 0,
      limit: 20,
    });
    expect(result.current.items).toEqual(mockItems);
    expect(result.current.loading).toBe(false);
  });

  it('fetches single item when searchTerm is provided', async () => {
    const { result } = renderHook(() => usePagination('bulbasaur'), { wrapper });
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(pokemonApi.endpoints.getSinglePokemon.initiate).toHaveBeenCalledWith('bulbasaur');
    expect(result.current.items).toEqual([mockItem]);
    expect(result.current.loading).toBe(false);
  });

  it('sets error state when API throws', async () => {
    vi.mocked(pokemonApi.endpoints.getAllPokemons.initiate).mockReturnValue(
      (() => Promise.reject(new Error('Server error. Please try again later'))) as never
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

  it('uses initialPage when page URL param resolves to 0', async () => {
    const localWrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/?page=0']}>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => usePagination('', 3), {
      wrapper: localWrapper,
    });
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(result.current.currentPage).toBe(3);
  });

  it('clears error on new fetch', async () => {
    vi.mocked(pokemonApi.endpoints.getSinglePokemon.initiate).mockReturnValueOnce(
      (() => Promise.reject(new Error('Pokemon not found. Please check the name'))) as never
    );
    const { result, rerender } = renderHook(
      ({ term }: { term: string }) => usePagination(term),
      { wrapper, initialProps: { term: 'badterm' } }
    );
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(result.current.error).toBe('Pokemon not found. Please check the name');

    rerender({ term: 'bulbasaur' });
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(result.current.error).toBeNull();
  });
});
