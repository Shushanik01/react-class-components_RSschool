import { render, screen, act } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DetailsPannel from '../components/DetailsPannel/DetailsPannel';
import pokemonListReducer from '../slices/pokemonListSlice';
import pokemonDetailsReducer from '../slices/pokemonDetailsSlice';
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

const createTestStore = () =>
  configureStore({
    reducer: {
      pokemonList: pokemonListReducer,
      pokemonDetails: pokemonDetailsReducer,
    },
  });

const renderWithStore = (ui: React.ReactElement) => {
  const store = createTestStore();
  return render(<Provider store={store}>{ui}</Provider>);
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
    renderWithStore(<DetailsPannel />);
    expect(screen.getByText(/pokémon details/i)).toBeInTheDocument();
  });

  it('renders the close button', () => {
    renderWithStore(<DetailsPannel />);
    expect(screen.getByRole('button', { name: '✕' })).toBeInTheDocument();
  });

  it('shows pokemon details after fetch completes', async () => {
    renderWithStore(<DetailsPannel />);
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
    renderWithStore(<DetailsPannel />);
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(screen.getByText(/pokemon not found/i)).toBeInTheDocument();
  });

  it('navigates to "/" when close button is clicked', () => {
    renderWithStore(<DetailsPannel />);
    fireEvent.click(screen.getByRole('button', { name: '✕' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('does not fetch when id is undefined', async () => {
    mockUseParams.mockReturnValue({ id: undefined as unknown as string });
    renderWithStore(<DetailsPannel />);
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(api.getData).not.toHaveBeenCalled();
  });

  it('renders stats and height when details include them', async () => {
    vi.mocked(api.getData).mockResolvedValue(mockItemWithStats);
    renderWithStore(<DetailsPannel />);
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(screen.getByText('hp:')).toBeInTheDocument();
    expect(screen.getByText('attack:')).toBeInTheDocument();
    expect(screen.getByText('0.7 m')).toBeInTheDocument();
  });
});
