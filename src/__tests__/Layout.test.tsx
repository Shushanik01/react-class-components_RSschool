import { render, screen, fireEvent } from '@testing-library/react';
import Layout from '../components/Layout/Layout';
import * as usePaginationModule from '../hooks/usePagination';
import { mockItems } from './mocks/mockData';

const mockNavigate = vi.hoisted(() => vi.fn());
const mockUseMatch = vi.hoisted(() => vi.fn(() => null));

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useMatch: mockUseMatch,
    Outlet: () => <div data-testid="outlet" />,
  };
});

vi.mock('../hooks/usePagination');

vi.mock('../hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(() => ['', vi.fn()]),
}));

const defaultPagination = {
  items: mockItems,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 2,
  goToPage: vi.fn(),
  nextPage: vi.fn(),
  prevPage: vi.fn(),
  resetPage: vi.fn(),
};

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMatch.mockReturnValue(null);
    vi.mocked(usePaginationModule.usePagination).mockReturnValue(
      defaultPagination
    );
    window.scrollTo = vi.fn() as typeof window.scrollTo;
  });

  it('renders the search bar', () => {
    render(<Layout />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('shows loading spinner while loading', () => {
    vi.mocked(usePaginationModule.usePagination).mockReturnValue({
      ...defaultPagination,
      loading: true,
      items: [],
    });
    render(<Layout />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    vi.mocked(usePaginationModule.usePagination).mockReturnValue({
      ...defaultPagination,
      loading: false,
      error: 'Something went wrong',
      items: [],
    });
    render(<Layout />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders card list when items are loaded', () => {
    render(<Layout />);
    expect(screen.getByText(/Name: bulbasaur/i)).toBeInTheDocument();
  });

  it('renders pagination when items are available and not loading', () => {
    render(<Layout />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Previous' })
    ).toBeInTheDocument();
  });

  it('does not render pagination while loading', () => {
    vi.mocked(usePaginationModule.usePagination).mockReturnValue({
      ...defaultPagination,
      loading: true,
      items: [],
    });
    render(<Layout />);
    expect(
      screen.queryByRole('button', { name: 'Next' })
    ).not.toBeInTheDocument();
  });

  it('does not render pagination when items list is empty', () => {
    vi.mocked(usePaginationModule.usePagination).mockReturnValue({
      ...defaultPagination,
      items: [],
      loading: false,
    });
    render(<Layout />);
    expect(
      screen.queryByRole('button', { name: 'Next' })
    ).not.toBeInTheDocument();
  });

  it('navigates to /about when About button is clicked', () => {
    render(<Layout />);
    fireEvent.click(screen.getByRole('button', { name: 'About' }));
    expect(mockNavigate).toHaveBeenCalledWith('/about');
  });

  it('navigates to /details/:id when View Details is clicked', () => {
    render(<Layout />);
    fireEvent.click(screen.getAllByRole('button', { name: 'View Details' })[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/details/1');
  });

  it('renders Outlet when a details route is matched', () => {
    mockUseMatch.mockReturnValue({ params: { id: '1' } });
    render(<Layout />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('does not render Outlet when no details route is matched', () => {
    render(<Layout />);
    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
  });
});
