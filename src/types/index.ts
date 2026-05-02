export interface SearchProps {
    onSearch: (term: string) => void,
    initialValue: string
}

export interface SearchState {
    inputValue: string,
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
    name: string,
    type: string,
    weight: number,
    ability: string,
    image: string
}

export interface ErrorBoundaryProps {
    hasError: boolean,
    error: Error | null
}