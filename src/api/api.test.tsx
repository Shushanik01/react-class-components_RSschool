import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { ReactNode } from 'react';
import { pokemonApi, useGetSinglePokemonQuery, useGetAllPokemonsQuery } from './api';
import { mockItem } from '../__tests__/mocks/mockData';

const createStore = () => {
  const store = configureStore({
    reducer: { [pokemonApi.reducerPath]: pokemonApi.reducer },
    middleware: (m) => m().concat(pokemonApi.middleware),
  });
  setupListeners(store.dispatch);
  return store;
};

type TestStore = ReturnType<typeof createStore>;

const makeWrapper = (store: TestStore) =>
  ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

const makeJsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('pokemonApi / useGetSinglePokemonQuery', () => {
  let store: TestStore;
  let wrapper: ReturnType<typeof makeWrapper>;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    store = createStore();
    wrapper = makeWrapper(store);
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is in loading state while the request is in flight', () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useGetSinglePokemonQuery('bulbasaur'), { wrapper });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('returns pokemon data on a successful fetch', async () => {
    fetchMock.mockResolvedValue(makeJsonResponse(mockItem));
    const { result } = renderHook(() => useGetSinglePokemonQuery('bulbasaur'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockItem);
  });

  it('transforms a 404 response into the correct error message', async () => {
    fetchMock.mockResolvedValue(makeJsonResponse({}, 404));
    const { result } = renderHook(() => useGetSinglePokemonQuery('missingno'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual({
      message: 'Pokemon not found. Please check the name',
    });
  });

  it('transforms a 400 response into the correct error message', async () => {
    fetchMock.mockResolvedValue(makeJsonResponse({}, 400));
    const { result } = renderHook(() => useGetSinglePokemonQuery('???'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual({
      message: 'Invalid request. Please check your input',
    });
  });

  it('transforms a 503 response into the correct error message', async () => {
    fetchMock.mockResolvedValue(makeJsonResponse({}, 503));
    const { result } = renderHook(() => useGetSinglePokemonQuery('bulbasaur'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual({
      message: 'Service is temporarily unavailable',
    });
  });

  it('falls back to a generic error message for unknown status codes', async () => {
    fetchMock.mockResolvedValue(makeJsonResponse({}, 500));
    const { result } = renderHook(() => useGetSinglePokemonQuery('bulbasaur'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual({ message: 'Something went wrong' });
  });

  it('does not fetch when skip is true', () => {
    fetchMock.mockResolvedValue(makeJsonResponse(mockItem));
    const { result } = renderHook(
      () => useGetSinglePokemonQuery('bulbasaur', { skip: true }),
      { wrapper }
    );
    expect(result.current.isUninitialized).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('serves subsequent identical queries from cache without a new fetch', async () => {
    fetchMock.mockResolvedValue(makeJsonResponse(mockItem));

    const { result: r1 } = renderHook(
      () => useGetSinglePokemonQuery('bulbasaur'),
      { wrapper }
    );
    await waitFor(() => expect(r1.current.isSuccess).toBe(true));

    const { result: r2 } = renderHook(
      () => useGetSinglePokemonQuery('bulbasaur'),
      { wrapper }
    );
    await waitFor(() => expect(r2.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(r2.current.data).toEqual(mockItem);
  });

  it('makes a new fetch for different query arguments', async () => {
    fetchMock
      .mockResolvedValueOnce(makeJsonResponse(mockItem))
      .mockResolvedValueOnce(makeJsonResponse({ ...mockItem, id: 4, name: 'charmander' }));

    const { result: r1 } = renderHook(
      () => useGetSinglePokemonQuery('bulbasaur'),
      { wrapper }
    );
    await waitFor(() => expect(r1.current.isSuccess).toBe(true));

    const { result: r2 } = renderHook(
      () => useGetSinglePokemonQuery('charmander'),
      { wrapper }
    );
    await waitFor(() => expect(r2.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(r2.current.data?.name).toBe('charmander');
  });
});

describe('pokemonApi / useGetAllPokemonsQuery', () => {
  let store: TestStore;
  let wrapper: ReturnType<typeof makeWrapper>;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    store = createStore();
    wrapper = makeWrapper(store);
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is in loading state while the request is in flight', () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(
      () => useGetAllPokemonsQuery({ offset: 0, limit: 20 }),
      { wrapper }
    );
    expect(result.current.isLoading).toBe(true);
  });

  it('returns full pokemon data after transformResponse fetches details', async () => {
    fetchMock
      .mockResolvedValueOnce(
        makeJsonResponse({
          results: [{ url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
          count: 100,
        })
      )
      .mockResolvedValueOnce(makeJsonResponse(mockItem));

    const { result } = renderHook(
      () => useGetAllPokemonsQuery({ offset: 0, limit: 20 }),
      { wrapper }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.count).toBe(100);
    expect(result.current.data?.results).toEqual([mockItem]);
  });

  it('transforms a 503 error for the list endpoint', async () => {
    fetchMock.mockResolvedValue(makeJsonResponse({}, 503));
    const { result } = renderHook(
      () => useGetAllPokemonsQuery({ offset: 0, limit: 20 }),
      { wrapper }
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual({
      message: 'Service is temporarily unavailable',
    });
  });

  it('transforms a 404 error for the list endpoint', async () => {
    fetchMock.mockResolvedValue(makeJsonResponse({}, 404));
    const { result } = renderHook(
      () => useGetAllPokemonsQuery({ offset: 0, limit: 20 }),
      { wrapper }
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual({ message: 'Pokemon list not found' });
  });

  it('falls back to a generic error message for unknown status codes', async () => {
    fetchMock.mockResolvedValue(makeJsonResponse({}, 500));
    const { result } = renderHook(
      () => useGetAllPokemonsQuery({ offset: 0, limit: 20 }),
      { wrapper }
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual({
      message: 'Failed to load pokemon list. Please try again',
    });
  });

  it('serves repeated queries with the same args from cache without a new fetch', async () => {
    fetchMock
      .mockResolvedValueOnce(
        makeJsonResponse({
          results: [{ url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
          count: 100,
        })
      )
      .mockResolvedValueOnce(makeJsonResponse(mockItem));

    const { result: r1 } = renderHook(
      () => useGetAllPokemonsQuery({ offset: 0, limit: 20 }),
      { wrapper }
    );
    await waitFor(() => expect(r1.current.isSuccess).toBe(true));

    const { result: r2 } = renderHook(
      () => useGetAllPokemonsQuery({ offset: 0, limit: 20 }),
      { wrapper }
    );
    await waitFor(() => expect(r2.current.isSuccess).toBe(true));

    // 2 fetches total (list + 1 detail fetch), not 4 — second hook hit the cache
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(r2.current.data).toEqual(r1.current.data);
  });

  it('fetches fresh data for a different offset value', async () => {
    fetchMock
      .mockResolvedValueOnce(
        makeJsonResponse({ results: [{ url: 'https://pokeapi.co/api/v2/pokemon/1/' }], count: 100 })
      )
      .mockResolvedValueOnce(makeJsonResponse(mockItem))
      .mockResolvedValueOnce(
        makeJsonResponse({ results: [{ url: 'https://pokeapi.co/api/v2/pokemon/4/' }], count: 100 })
      )
      .mockResolvedValueOnce(makeJsonResponse({ ...mockItem, id: 4, name: 'charmander' }));

    const { result: r1 } = renderHook(
      () => useGetAllPokemonsQuery({ offset: 0, limit: 20 }),
      { wrapper }
    );
    await waitFor(() => expect(r1.current.isSuccess).toBe(true));

    const { result: r2 } = renderHook(
      () => useGetAllPokemonsQuery({ offset: 20, limit: 20 }),
      { wrapper }
    );
    await waitFor(() => expect(r2.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(r2.current.data?.results[0].name).toBe('charmander');
  });
});
