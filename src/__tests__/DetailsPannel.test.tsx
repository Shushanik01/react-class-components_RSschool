import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DetailsPannel from '../components/DetailsPannel/DetailsPannel';
import pokemonListReducer from '../slices/pokemonListSlice';
import selectedItemsReducer from '../slices/selectedItemsSlice';
import { useGetSinglePokemonQuery } from '../api/api';
import { mockItem } from './mocks/mockData';
import type { Item } from '../types';

vi.mock('../api/api', () => ({
  useGetSinglePokemonQuery: vi.fn(),
  pokemonApi: {},
}));

const mockNavigate = vi.hoisted(() => vi.fn());
const mockUseParams = vi.hoisted(() => vi.fn(() => ({ id: '1' as string | undefined })));

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useParams: mockUseParams,
    useNavigate: () => mockNavigate,
  };
});

type SingleQueryResult = ReturnType<typeof useGetSinglePokemonQuery>;

const mockQuery = (overrides: object) =>
  overrides as unknown as SingleQueryResult;

const defaultQueryResult = {
  data: undefined,
  isLoading: false,
  isFetching: false,
  isSuccess: false,
  isError: false,
  isUninitialized: false,
  error: undefined,
};

const mockItemWithStats: Item = {
  ...mockItem,
  height: 7,
  stats: [
    { base_stat: 45, effort: 0, stat: { name: 'hp', url: '' } },
    { base_stat: 49, effort: 0, stat: { name: 'attack', url: '' } },
  ],
};

const createTestStore = () =>
  configureStore({
    reducer: {
      pokemonList: pokemonListReducer,
      selectedItems: selectedItemsReducer,
    },
  });

const renderWithStore = (ui: React.ReactElement) => {
  const store = createTestStore();
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('DetailsPannel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ id: '1' });
    vi.mocked(useGetSinglePokemonQuery).mockReturnValue(
      mockQuery({ ...defaultQueryResult, data: mockItem, isSuccess: true })
    );
  });

  it('renders the Pokémon Details header', () => {
    renderWithStore(<DetailsPannel />);
    expect(screen.getByText(/pokémon details/i)).toBeInTheDocument();
  });

  it('renders the close button', () => {
    renderWithStore(<DetailsPannel />);
    expect(screen.getByRole('button', { name: '✕' })).toBeInTheDocument();
  });

  it('shows loading spinner while the query is in flight', () => {
    vi.mocked(useGetSinglePokemonQuery).mockReturnValue(
      mockQuery({ ...defaultQueryResult, isLoading: true })
    );
    renderWithStore(<DetailsPannel />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows pokemon name and data after the query succeeds', () => {
    renderWithStore(<DetailsPannel />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });

  it('shows error message when the query fails with a message', () => {
    vi.mocked(useGetSinglePokemonQuery).mockReturnValue(
      mockQuery({
        ...defaultQueryResult,
        isError: true,
        error: { message: 'Pokemon not found. Please check the name' },
      })
    );
    renderWithStore(<DetailsPannel />);
    expect(screen.getByText(/pokemon not found/i)).toBeInTheDocument();
  });

  it('navigates to "/" when the close button is clicked', () => {
    renderWithStore(<DetailsPannel />);
    fireEvent.click(screen.getByRole('button', { name: '✕' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('passes skip: true to the query when id is undefined', () => {
    mockUseParams.mockReturnValue({ id: undefined });
    vi.mocked(useGetSinglePokemonQuery).mockReturnValue(
      mockQuery({ ...defaultQueryResult, isUninitialized: true })
    );
    renderWithStore(<DetailsPannel />);
    expect(useGetSinglePokemonQuery).toHaveBeenCalledWith('', { skip: true });
  });

  it('renders stats and height when the data includes them', () => {
    vi.mocked(useGetSinglePokemonQuery).mockReturnValue(
      mockQuery({
        ...defaultQueryResult,
        data: mockItemWithStats,
        isSuccess: true,
      })
    );
    renderWithStore(<DetailsPannel />);
    expect(screen.getByText('hp:')).toBeInTheDocument();
    expect(screen.getByText('attack:')).toBeInTheDocument();
    expect(screen.getByText('0.7 m')).toBeInTheDocument();
  });

  it('shows fallback error text when error has no message property', () => {
    vi.mocked(useGetSinglePokemonQuery).mockReturnValue(
      mockQuery({
        ...defaultQueryResult,
        isError: true,
        error: { status: 503 },
      })
    );
    renderWithStore(<DetailsPannel />);
    expect(screen.getByText(/Failed to load pokemon/i)).toBeInTheDocument();
  });
});
