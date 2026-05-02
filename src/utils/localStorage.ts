const SEARCH_TERM_KEY = 'searchTerm';

export const getStoredSearchTerm = (): string => {
  return localStorage.getItem(SEARCH_TERM_KEY) ?? '';
};

export const setStoredSearchTerm = (value: string): void => {
  localStorage.setItem(SEARCH_TERM_KEY, value);
};
