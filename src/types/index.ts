export interface SearchProps {
  onSearch: (term: string) => void;
  initialValue: string;
}

export interface SearchState {
  inputValue: string;
}

export interface AppState {
  searchTerm: string;
  items: Item[];
  loading: boolean;
  error: string | null;
}

export interface Item {
  id: number;
  name: string;
  weight: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  sprites: { front_default: string };
}

export interface CardListProps {
  items: Item[];
}

export interface CardItemProps {
  name: string;
  type: string;
  weight: number;
  ability: string;
  image: string;
}

export interface ErrorBoundaryProps {
  hasError: boolean;
  error: Error | null;
};

export interface Pokemon {
  name: string;
  url: string;
  id?: number;
  types?: { type: { name: string } }[];
  weight?: number;
  abilities?: { ability: { name: string } }[];
  sprites?: { front_default: string };
}

export interface UsePaginationReturn {
  items: Pokemon[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  resetPage: () => void;
}
