export const getStoredSearchTerm = (): string => {
  return localStorage.getItem('inputValue') ?? '';
};

export const setStoredSearchTerm = (value: string): void => {
  localStorage.setItem('inputValue', value);
};
