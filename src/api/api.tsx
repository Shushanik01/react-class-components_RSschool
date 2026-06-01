import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { Item } from '../types';
const cachTime = Number(import.meta.env.VITE_CACH_TTL)

export const pokemonApi = createApi({
    reducerPath: 'pokemonAPI',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2' }),
    tagTypes: ['Pokemon'],
    endpoints: (build) => ({
        getSinglePokemon: build.query<Item, string>({
            query: (name) => `pokemon/${name}`,
            transformErrorResponse: (response: FetchBaseQueryError) => {
                if (response.status === 404) return { message: 'Pokemon not found. Please check the name' };
                if (response.status === 400) return { message: 'Invalid request. Please check your input' };
                if (response.status === 503) return { message: 'Service is temporarily unavailable' };
                return { message: 'Something went wrong' };
            },
            providesTags: ['Pokemon'],
            keepUnusedDataFor: cachTime
        }),
        getAllPokemons: build.query<
            { results: Item[]; count: number },
            { offset: number; limit: number }
        >({
            query: ({ offset, limit }) => `pokemon/?offset=${offset}&limit=${limit}`,
            transformErrorResponse: (response: FetchBaseQueryError) => {
                if (response.status === 503) return { message: 'Service is temporarily unavailable' };
                if (response.status === 404) return { message: 'Pokemon list not found' };
                return { message: 'Failed to load pokemon list. Please try again' };
            },
            providesTags: ['Pokemon'],
            keepUnusedDataFor: cachTime,
            transformResponse: async (base: {
                results: { url: string }[];
                count: number;
            }) => {
                const details = await Promise.all(
                    base.results.map((p) => fetch(p.url).then((r) => r.json()))
                );
                return { results: details as Item[], count: base.count };
            },
        }),
    }),
});
export const { useGetSinglePokemonQuery, useGetAllPokemonsQuery } = pokemonApi;
