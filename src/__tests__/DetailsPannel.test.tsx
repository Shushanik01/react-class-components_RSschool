import { render, screen, act } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import DetailsPannel from '../components/DetailsPannel/DetailsPannel';
import * as api from '../services/api';
import { mockItem } from './mocks/mockData';
import type { Item } from '../types';

vi.mock('../services/api');

const mockNavigate = vi.hoisted(() => vi.fn());
const mockUseParams = vi.hoisted(() => vi.fn(() => ({ id: '1' })));

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useParams: mockUseParams,
    useNavigate: () => mockNavigate,
  };
});

const mockItemWithStats: Item = {
  ...mockItem,
  height: 7,
  stats: [
    { base_stat: 45, effort: 0, stat: { name: 'hp', url: '' } },
    { base_stat: 49, effort: 0, stat: { name: 'attack', url: '' } },
  ],
};

describe('DetailsPannel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ id: '1' });
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

  it('does not fetch when id is undefined', async () => {
    mockUseParams.mockReturnValue({ id: undefined });
    render(<DetailsPannel />);
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(api.getData).not.toHaveBeenCalled();
  });

  it('renders stats and height when details include them', async () => {
    vi.mocked(api.getData).mockResolvedValue(mockItemWithStats);
    render(<DetailsPannel />);
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(screen.getByText('hp:')).toBeInTheDocument();
    expect(screen.getByText('attack:')).toBeInTheDocument();
    expect(screen.getByText('0.7 m')).toBeInTheDocument();
  });
});
