export interface SearchProps {
    onSearch: (term: string) => void,
    initialValue: string
}

export interface SearchState {
    inputValue: string,
    hasError: boolean
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
    description: string;
    image: string;
}

export interface CardListProps {
  items: Item[];
}
