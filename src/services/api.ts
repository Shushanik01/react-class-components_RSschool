import { HTTP_STATUS } from '../constants';

const API_URL = 'https://pokeapi.co/api/v2';
const POKEMON_FETCH_LIMIT = 20;

const throwApiError = (response: Response): never => {
  if (response.status === HTTP_STATUS.NotFound) {
    throw new Error('Pokemon not found. Please check the name');
  }
  if (response.status === HTTP_STATUS.BadRequest) {
    throw new Error('Invalid request. Please check your input');
  }
  if (response.status === HTTP_STATUS.InternalServerError) {
    throw new Error('Server error. Please try again later');
  }
  if (response.status === HTTP_STATUS.ServiceUnavailable) {
    throw new Error('Service is temporarily unavailable');
  }
  throw new Error('Something went wrong');
};

export const getData = async (term: string) => {
  const response = await fetch(`${API_URL}/pokemon/${term.toLowerCase()}`);
  if (!response.ok) {
    throwApiError(response);
  }
  return response.json();
};

export const getAllData = async () => {
  const response = await fetch(
    `${API_URL}/pokemon?limit=${POKEMON_FETCH_LIMIT}`
  );
  if (!response.ok) {
    throwApiError(response);
  }
  const data = await response.json();
  const details = await Promise.all(
    data.results.map((pokemon: { url: string }) =>
      fetch(pokemon.url).then((response) => response.json())
    )
  );
  return details;
};
