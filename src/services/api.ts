const API_URL = 'https://pokeapi.co/api/v2';

const throwApiError = (response: Response): never => {
  if (response.status === 404) throw new Error('Pokemon not found. Please check the name');
  if (response.status === 400) throw new Error('Invalid request. Please check your input');
  if (response.status === 500) throw new Error('Server error. Please try again later');
  if (response.status === 503) throw new Error('Service is temporarily unavailable');
  throw new Error('Something went wrong');
};

export const getData = async (term: string) => {
  const response = await fetch(`${API_URL}/pokemon/${term.toLowerCase()}`);
  if (!response.ok) throwApiError(response);
  return response.json();
};

export const getAllData = async () => {
  const response = await fetch(`${API_URL}/pokemon?limit=20`);
  if (!response.ok) throwApiError(response);
  const data = await response.json();
  const details = await Promise.all(
    data.results.map((pokemon: { url: string }) =>
      fetch(pokemon.url).then((response) => response.json())
    )
  );
  return details;
};