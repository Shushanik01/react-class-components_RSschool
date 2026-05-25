import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Layout from '../components/Layout/Layout';
import pokemonListReducer from '../slices/pokemonListSlice';
import pokemonDetailsReducer from '../slices/pokemonDetailsSlice';
import selectedItemsReducer from '../slices/selectedItemsSlice';
import { mockItems } from './mocks/mockData';

const mockNavigate = vi.hoisted(() => vi.fn());
const mockUseMatch = vi.hoisted(() => vi.fn(() => null));
const mockSetSearchParams = vi.hoisted(() => vi.fn());

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useMatch: mockUseMatch,
    useSearchParams: () => [new URLSearchParams(), mockSetSearchParams],
    Outlet: () => <div data-testid="outlet" />,
  };
});

vi.mock('../slices/pokemonListSlice', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../slices/pokemonListSlice')>();
  return {
    ...actual,
    fetchPokemonList: vi.fn(() => ({ type: 'noop' })),
  };
});

vi.mock('../ThemeContext/context', () => ({
  useTheme: vi.fn(() => ({
    theme: 'Light',
    handleThemeChange: vi.fn(),
  })),
}));

const defaultListState = {
  items: mockItems,
  loading: false,
  error: null,
  currentPage: 1,
  totalCount: 40,
  searchTerm: '',
};

const createTestStore = (listState = defaultListState) =>
  configureStore({
    reducer: {
      pokemonList: pokemonListReducer,
      pokemonDetails: pokemonDetailsReducer,
      selectedItems: selectedItemsReducer,
    },
    preloadedState: {
      pokemonList: listState,
      pokemonDetails: { details: null, loading: false, error: null },
      selectedItems: { selectedIds: [] },
    },
  });

const renderWithStore = (listState = defaultListState) => {
  const store = createTestStore(listState);
  return render(
    <Provider store={store}>
      <Layout />
    </Provider>
  );
};

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMatch.mockReturnValue(null);
    window.scrollTo = vi.fn() as typeof window.scrollTo;
  });

  it('renders the search bar', () => {
    renderWithStore();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('shows loading spinner while loading', () => {
    renderWithStore({ ...defaultListState, loading: true, items: [] });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    renderWithStore({
      ...defaultListState,
      loading: false,
      error: 'Something went wrong',
      items: [],
    });
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders card list when items are loaded', () => {
    renderWithStore();
    expect(screen.getByText(/Name: bulbasaur/i)).toBeInTheDocument();
  });

  it('renders pagination when items are available and not loading', () => {
    renderWithStore();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Previous' })
    ).toBeInTheDocument();
  });

  it('does not render pagination while loading', () => {
    renderWithStore({ ...defaultListState, loading: true, items: [] });
    expect(
      screen.queryByRole('button', { name: 'Next' })
    ).not.toBeInTheDocument();
  });

  it('does not render pagination when items list is empty', () => {
    renderWithStore({ ...defaultListState, items: [], loading: false });
    expect(
      screen.queryByRole('button', { name: 'Next' })
    ).not.toBeInTheDocument();
  });

  it('navigates to /about when About button is clicked', () => {
    renderWithStore();
    fireEvent.click(screen.getByRole('button', { name: 'About' }));
    expect(mockNavigate).toHaveBeenCalledWith('/about');
  });

  it('navigates to /details/:id when View Details is clicked', () => {
    renderWithStore();
    fireEvent.click(screen.getAllByRole('button', { name: 'View Details' })[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/details/1');
  });

  it('renders Outlet when a details route is matched', () => {
    mockUseMatch.mockReturnValue({ params: { id: '1' } });
    renderWithStore();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('does not render Outlet when no details route is matched', () => {
    renderWithStore();
    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
  });
});
