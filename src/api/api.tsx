import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type { Item } from '../types';

export const pokemonApi = createApi({
    reducerPath: 'pokemonAPI',
    baseQuery: fetchBaseQuery({baseUrl: 'https://pokeapi.co/api/v2'}),
    endpoints: (build)=>({
        getSinglePokemon: build.query<Item, string>({
            query: (name) => `pokemon/${name}` 
        }),
        getAllPokemons: build.query<Item, { offset: number; limit: number }>({
            query: ({offset, limit})=> `pokemon/?offset=${offset}&limit=${limit}`
        }),
        
    })
});
export const {useGetSinglePokemonQuery, useGetAllPokemonsQuery} = pokemonApi 