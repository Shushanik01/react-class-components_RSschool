import { render, screen, act, fireEvent } from '@testing-library/react';
import App from '../App';
import { mockItem, mockItems } from './mocks/mockData';

vi.mock('../services/api');
vi.mock('../utils/localStorage');

import { getData, getAllData } from '../services/api';
import {
  getStoredSearchTerm,
  setStoredSearchTerm,
} from '../utils/localStorage';

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(getStoredSearchTerm).mockReturnValue('');
    vi.mocked(setStoredSearchTerm).mockImplementation(() => {});
    vi.mocked(getAllData).mockResolvedValue(mockItems);
    vi.mocked(getData).mockResolvedValue(mockItem);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  const mountAndSettle = async () => {
    render(<App />);
    await act(async () => {
      await vi.runAllTimersAsync();
    });
  };

  describe('Initial load', () => {
    it('shows loading spinner while fetching', async () => {
      render(<App />);
      expect(screen.getByRole('status')).toBeInTheDocument();
      await act(async () => {
        await vi.runAllTimersAsync();
      });
    });

    it('hides loading spinner after fetch completes', async () => {
      await mountAndSettle();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('makes initial API call on mount', async () => {
      await mountAndSettle();
      expect(getAllData).toHaveBeenCalledTimes(1);
    });

    it('displays all pokemon after successful fetch', async () => {
      await mountAndSettle();
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
      expect(screen.getByText(/charmander/i)).toBeInTheDocument();
    });
  });

  describe('localStorage integration', () => {
    it('reads stored search term on mount', async () => {
      vi.mocked(getStoredSearchTerm).mockReturnValue('pikachu');
      vi.mocked(getData).mockResolvedValue({ ...mockItem, name: 'pikachu' });

      await mountAndSettle();

      expect(getData).toHaveBeenCalledWith('pikachu');
    });

    it('displays stored search term in the input on mount', async () => {
      vi.mocked(getStoredSearchTerm).mockReturnValue('bulbasaur');

      await mountAndSettle();

      expect(screen.getByDisplayValue('bulbasaur')).toBeInTheDocument();
    });

    it('shows empty search input when no term is stored', async () => {
      vi.mocked(getStoredSearchTerm).mockReturnValue('');

      await mountAndSettle();

      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('saves search term to localStorage when search is performed', async () => {
      await mountAndSettle();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'squirtle' },
      });
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /search/i }));
        await vi.runAllTimersAsync();
      });

      expect(setStoredSearchTerm).toHaveBeenCalledWith('squirtle');
    });

    it('overwrites existing localStorage value on new search', async () => {
      vi.mocked(getStoredSearchTerm).mockReturnValue('bulbasaur');

      await mountAndSettle();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'squirtle' },
      });
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /search/i }));
        await vi.runAllTimersAsync();
      });

      expect(setStoredSearchTerm).toHaveBeenCalledWith('squirtle');
    });
  });

  describe('Search', () => {
    it('calls getData with the correct search term', async () => {
      vi.mocked(getData).mockResolvedValue({ ...mockItem, name: 'squirtle' });

      await mountAndSettle();

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'squirtle' },
      });
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /search/i }));
        await vi.runAllTimersAsync();
      });

      expect(getData).toHaveBeenCalledWith('squirtle');
    });

    it('does not re-fetch when the same search term is submitted', async () => {
      vi.mocked(getStoredSearchTerm).mockReturnValue('bulbasaur');

      await mountAndSettle();

      const callsBefore = vi.mocked(getData).mock.calls.length;

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /search/i }));
        await vi.runAllTimersAsync();
      });

      expect(vi.mocked(getData).mock.calls.length).toBe(callsBefore);
    });

    it('calls getAllData when search term is cleared', async () => {
      vi.mocked(getStoredSearchTerm).mockReturnValue('bulbasaur');

      await mountAndSettle();

      fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /search/i }));
        await vi.runAllTimersAsync();
      });

      expect(getAllData).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('displays error message when API call fails', async () => {
      vi.mocked(getAllData).mockRejectedValue(
        new Error('Pokemon not found. Please check the name')
      );

      await mountAndSettle();

      expect(
        screen.getByText('Pokemon not found. Please check the name')
      ).toBeInTheDocument();
    });

    it('hides error message on successful fetch', async () => {
      await mountAndSettle();
      expect(screen.queryByText(/not found/i)).not.toBeInTheDocument();
    });

    it('shows no results when search returns nothing', async () => {
      vi.mocked(getAllData).mockResolvedValue([]);

      await mountAndSettle();

      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });
});
