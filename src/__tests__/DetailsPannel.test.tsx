import { render, screen, act } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import DetailsPannel from '../components/DetailsPannel/DetailsPannel';
import * as api from '../services/api';
import { mockItem } from './mocks/mockData';

vi.mock('../services/api');

const mockNavigate = vi.hoisted(() => vi.fn());
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => mockNavigate,
  };
});

describe('DetailsPannel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    vi.mocked(api.getData).mockResolvedValue(mockItem);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the Pokémon Details header', () => {
    render(<DetailsPannel />);
    expect(screen.getByText(/pokémon details/i)).toBeInTheDocument();
  });

  it('renders the close button', () => {
    render(<DetailsPannel />);
    expect(screen.getByRole('button', { name: '✕' })).toBeInTheDocument();
  });

  it('shows pokemon details after fetch completes', async () => {
    render(<DetailsPannel />);
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(api.getData).toHaveBeenCalledWith('1');
  });

  it('shows error message when fetch fails', async () => {
    vi.mocked(api.getData).mockRejectedValue(
      new Error('Pokemon not found. Please check the name')
    );
    render(<DetailsPannel />);
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(screen.getByText(/pokemon not found/i)).toBeInTheDocument();
  });

  it('navigates to "/" when close button is clicked', () => {
    render(<DetailsPannel />);
    fireEvent.click(screen.getByRole('button', { name: '✕' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
