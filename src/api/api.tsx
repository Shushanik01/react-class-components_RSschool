import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { Item } from '../types';
const cachTime = Number(import.meta.env.VITE_CACH_TTL);

export const pokemonApi = createApi({
  reducerPath: 'pokemonAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2' }),
  tagTypes: ['Pokemon'],
  endpoints: (build) => ({
    getSinglePokemon: build.query<Item, string>({
      query: (name) => `pokemon/${name}`,
      transformErrorResponse: (response: FetchBaseQueryError) => {
        if (response.status === 404)
          return { message: 'Pokemon not found. Please check the name' };
        if (response.status === 400)
          return { message: 'Invalid request. Please check your input' };
        if (response.status === 503)
          return { message: 'Service is temporarily unavailable' };
        return { message: 'Something went wrong' };
      },
      providesTags: ['Pokemon'],
      keepUnusedDataFor: cachTime,
    }),
    getAllPokemons: build.query<
      { results: Item[]; count: number },
      { offset: number; limit: number }
    >({
      queryFn: async ({ offset, limit }, { dispatch }) => {
        const toError = (message: string) =>
          ({ message }) as unknown as FetchBaseQueryError;
        try {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`
          );
          if (!response.ok) {
            if (response.status === 503)
              return { error: toError('Service is temporarily unavailable') };
            if (response.status === 404)
              return { error: toError('Pokemon list not found') };
            return {
              error: toError('Failed to load pokemon list. Please try again'),
            };
          }
          const base: { results: { url: string }[]; count: number } =
            await response.json();

          const details: Array<Item | undefined> = await Promise.all(
            base.results.map(async (p) => {
              const id = p.url.split('/').filter(Boolean).pop()!;
              const result = (await dispatch(
                pokemonApi.endpoints.getSinglePokemon.initiate(id)
              )) as unknown as { data?: Item };
              return result.data;
            })
          );

          return {
            data: {
              results: details.filter((d): d is Item => d !== undefined),
              count: base.count,
            },
          };
        } catch (err) {
          return { error: toError((err as Error).message) };
        }
      },
      providesTags: ['Pokemon'],
      keepUnusedDataFor: cachTime,
    }),
  }),
});
export const { useGetSinglePokemonQuery, useGetAllPokemonsQuery } = pokemonApi;
