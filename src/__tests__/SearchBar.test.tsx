import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../components/SearchBar/SearchBar';

const onSearch = vi.fn();

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders the search input', () => {
      render(<SearchBar onSearch={onSearch} initialValue="" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders the search button', () => {
      render(<SearchBar onSearch={onSearch} initialValue="" />);
      expect(
        screen.getByRole('button', { name: /search/i })
      ).toBeInTheDocument();
    });

    it('shows stored value from localStorage in the input', () => {
      localStorage.setItem('searchTerm', 'pikachu');
      render(<SearchBar onSearch={onSearch} initialValue="" />);
      expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    });

    it('shows empty input when localStorage is empty', () => {
      render(<SearchBar onSearch={onSearch} initialValue="" />);
      expect(screen.getByRole('textbox')).toHaveValue('');
    });
  });

  describe('User interaction', () => {
    it('updates input value when user types', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={onSearch} initialValue="" />);
      const input = screen.getByRole('textbox');
      await user.type(input, 'bulbasaur');
      expect(input).toHaveValue('bulbasaur');
    });

    it('calls onSearch with typed value when button is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={onSearch} initialValue="" />);
      await user.type(screen.getByRole('textbox'), 'charmander');
      await user.click(screen.getByRole('button', { name: /search/i }));
      expect(onSearch).toHaveBeenCalledWith('charmander');
    });

    it('calls onSearch when Enter key is pressed', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={onSearch} initialValue="" />);
      const input = screen.getByRole('textbox');
      await user.type(input, 'squirtle');
      await user.keyboard('{Enter}');
      expect(onSearch).toHaveBeenCalledWith('squirtle');
    });

    it('trims whitespace from input before calling onSearch', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={onSearch} initialValue="" />);
      await user.type(screen.getByRole('textbox'), '  bulbasaur  ');
      await user.click(screen.getByRole('button', { name: /search/i }));
      expect(screen.getByRole('textbox')).toHaveValue('bulbasaur');
    });

    it('does not call onSearch for non-Enter keys', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={onSearch} initialValue="" />);
      await user.type(screen.getByRole('textbox'), 'abc');
      await user.keyboard('{Escape}');
      expect(onSearch).not.toHaveBeenCalled();
    });

    it('calls onSearch on mount when localStorage has a stored value', () => {
      localStorage.setItem('searchTerm', 'pikachu');
      render(<SearchBar onSearch={onSearch} initialValue="" />);
      expect(onSearch).toHaveBeenCalledWith('pikachu');
    });
  });

  describe('localStorage persistence', () => {
    it('saves searched value to localStorage', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={onSearch} initialValue="" />);
      await user.type(screen.getByRole('textbox'), 'charmander');
      await user.click(screen.getByRole('button', { name: /search/i }));
      expect(localStorage.getItem('searchTerm')).toBe('charmander');
    });
  });
});
