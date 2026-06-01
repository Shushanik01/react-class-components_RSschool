import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RefreshBtn from '../components/refreshBtn/refreshBtn';
import pokemonListReducer from '../slices/pokemonListSlice';
import selectedItemsReducer from '../slices/selectedItemsSlice';

const mockInvalidateTags = vi.hoisted(() => vi.fn(() => ({ type: 'noop' })));

vi.mock('../api/api', () => ({
  pokemonApi: {
    reducerPath: 'pokemonAPI',
    reducer: (state: unknown = {}) => state,
    middleware: () => (next: (a: unknown) => unknown) => (action: unknown) =>
      next(action),
    util: {
      invalidateTags: mockInvalidateTags,
    },
  },
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      pokemonList: pokemonListReducer,
      selectedItems: selectedItemsReducer,
    },
  });

const renderRefreshBtn = () => {
  const store = createTestStore();
  render(
    <Provider store={store}>
      <RefreshBtn />
    </Provider>
  );
};

describe('RefreshBtn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the refresh button', () => {
    renderRefreshBtn();
    expect(
      screen.getByRole('button', { name: /refresh/i })
    ).toBeInTheDocument();
  });

  it('calls invalidateTags with Pokemon tag when clicked', () => {
    renderRefreshBtn();
    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));
    expect(mockInvalidateTags).toHaveBeenCalledWith(['Pokemon']);
  });
});
