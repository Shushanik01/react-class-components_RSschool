import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Layout from '../components/Layout/Layout';
import pokemonListReducer from '../slices/pokemonListSlice';
import selectedItemsReducer from '../slices/selectedItemsSlice';
import { useGetAllPokemonsQuery, useGetSinglePokemonQuery } from '../api/api';
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

vi.mock('../api/api', () => ({
  useGetAllPokemonsQuery: vi.fn(),
  useGetSinglePokemonQuery: vi.fn(),
  pokemonApi: {
    reducerPath: 'pokemonAPI',
    reducer: (state: unknown = {}) => state,
    middleware:
      (_api: unknown) =>
      (next: Function) =>
      (action: unknown) =>
        next(action),
    endpoints: {
      getSinglePokemon: { initiate: vi.fn(() => ({ type: 'noop' })) },
    },
    util: {
      invalidateTags: vi.fn(() => ({ type: 'noop' })),
    },
  },
}));

type AllQueryResult = ReturnType<typeof useGetAllPokemonsQuery>;
type SingleQueryResult = ReturnType<typeof useGetSinglePokemonQuery>;

const mockAll = (
  overrides: Partial<{ data: AllQueryResult['data']; isLoading: boolean; isFetching: boolean; error: unknown }>
) =>
  overrides as unknown as AllQueryResult;

const mockSingle = (
  overrides: Partial<{ data: SingleQueryResult['data']; isLoading: boolean; isFetching: boolean; error: unknown }>
) =>
  overrides as unknown as SingleQueryResult;

const createTestStore = () =>
  configureStore({
    reducer: {
      pokemonList: pokemonListReducer,
      selectedItems: selectedItemsReducer,
    },
    preloadedState: {
      pokemonList: {
        items: [],
        loading: false,
        error: null,
        currentPage: 1,
        totalCount: 40,
        searchTerm: '',
      },
      selectedItems: { selectedIds: [] },
    },
  });

const renderWithStore = () => {
  const store = createTestStore();
  const result = render(
    <Provider store={store}>
      <Layout />
    </Provider>
  );
  return { ...result, store };
};

const createSelectedStore = () =>
  configureStore({
    reducer: {
      pokemonList: pokemonListReducer,
      selectedItems: selectedItemsReducer,
    },
    preloadedState: {
      pokemonList: {
        items: [],
        loading: false,
        error: null,
        currentPage: 1,
        totalCount: 40,
        searchTerm: '',
      },
      selectedItems: { selectedIds: [1] },
    },
  });

const renderWithSelectedStore = () => {
  const store = createSelectedStore();
  const result = render(
    <Provider store={store}>
      <Layout />
    </Provider>
  );
  return { ...result, store };
};

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockUseMatch.mockReturnValue(null);
    window.scrollTo = vi.fn() as typeof window.scrollTo;

    vi.mocked(useGetAllPokemonsQuery).mockReturnValue(
      mockAll({ data: { results: mockItems, count: 40 }, isLoading: false, isFetching: false, error: undefined })
    );
    vi.mocked(useGetSinglePokemonQuery).mockReturnValue(
      mockSingle({ data: undefined, isLoading: false, isFetching: false, error: undefined })
    );
  });

  it('renders the search bar', () => {
    renderWithStore();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('shows loading spinner while loading', () => {
    vi.mocked(useGetAllPokemonsQuery).mockReturnValue(
      mockAll({ data: undefined, isLoading: true, isFetching: false, error: undefined })
    );
    renderWithStore();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    vi.mocked(useGetAllPokemonsQuery).mockReturnValue(
      mockAll({ data: undefined, isLoading: false, isFetching: false, error: { message: 'Something went wrong' } })
    );
    renderWithStore();
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
    vi.mocked(useGetAllPokemonsQuery).mockReturnValue(
      mockAll({ data: undefined, isLoading: true, isFetching: false, error: undefined })
    );
    renderWithStore();
    expect(
      screen.queryByRole('button', { name: 'Next' })
    ).not.toBeInTheDocument();
  });

  it('does not render pagination when items list is empty', () => {
    vi.mocked(useGetAllPokemonsQuery).mockReturnValue(
      mockAll({ data: { results: [], count: 0 }, isLoading: false, isFetching: false, error: undefined })
    );
    renderWithStore();
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
    mockUseMatch.mockReturnValue({ params: { id: '1' } } as unknown as null);
    renderWithStore();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('does not render Outlet when no details route is matched', () => {
    renderWithStore();
    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
  });

  it('shows fallback message when error has no message field', () => {
    vi.mocked(useGetAllPokemonsQuery).mockReturnValue(
      mockAll({ data: undefined, isLoading: false, isFetching: false, error: { status: 404 } })
    );
    renderWithStore();
    expect(screen.getByText('Failed to load pokemon')).toBeInTheDocument();
  });

  it('dispatches setSearchTerm when Search button is clicked', () => {
    const { store } = renderWithStore();
    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: 'bulbasaur' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(store.getState().pokemonList.searchTerm).toBe('bulbasaur');
  });

  it('dispatches setCurrentPage when Next button is clicked', () => {
    const { store } = renderWithStore();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(store.getState().pokemonList.currentPage).toBe(2);
  });

  it('toggles item selection when checkbox is clicked', () => {
    const { store } = renderWithStore();
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(store.getState().selectedItems.selectedIds).toContain(1);
  });

  it('clears selection when Unselect all is clicked', () => {
    const { store } = renderWithSelectedStore();
    fireEvent.click(screen.getByRole('button', { name: 'Unselect all' }));
    expect(store.getState().selectedItems.selectedIds).toEqual([]);
  });

  it('downloads CSV when Download button is clicked', async () => {
    URL.createObjectURL = vi.fn(() => 'blob:url');
    URL.revokeObjectURL = vi.fn();
    const anchor = { href: '', download: '', click: vi.fn() };
    const origCreate = document.createElement.bind(document);
    const createSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tag: string) => {
        if (tag === 'a') return anchor as unknown as HTMLElement;
        return origCreate(tag);
      });

    renderWithSelectedStore();
    fireEvent.click(screen.getByRole('button', { name: 'Download' }));

    await waitFor(() => {
      expect(anchor.click).toHaveBeenCalled();
    });

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:url');
    createSpy.mockRestore();
  });
});
