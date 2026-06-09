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
export interface Stat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface Item {
  id: number;
  name: string;
  weight: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  sprites: { front_default: string };
  height?: number;
  stats?: Stat[];
}

export interface CardListProps {
  items: Item[];
  onCardClick: (id: number) => void;
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
}

export interface CardItemProps {
  id: number;
  name: string;
  type: string;
  weight: number;
  ability: string;
  image: string;
  isSelected: boolean;
  onCardClick: (id: number) => void;
  onToggleSelect: (id: number) => void;
}

export interface ErrorBoundaryProps {
  hasError: boolean;
  error: Error | null;
}

export interface UsePaginationReturn {
  items: Item[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  resetPage: () => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface UserProfile {
  profilePicture: string,
  username: string,
  password: string
}