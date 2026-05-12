import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../components/SearchBar/SearchBar';

const onSearch = vi.fn();

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the search input', () => {
      render(<SearchBar onSearch={onSearch} initialValue="" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders the search button', () => {
      render(<SearchBar onSearch={onSearch} initialValue="" />);
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    it('displays the initialValue in the input', () => {
      render(<SearchBar onSearch={onSearch} initialValue="pikachu" />);
      expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    });

    it('shows empty input when initialValue is empty string', () => {
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
  });

  describe('Props sync', () => {
    it('syncs input value when initialValue prop changes', () => {
      const { rerender } = render(
        <SearchBar onSearch={onSearch} initialValue="bulbasaur" />
      );
      expect(screen.getByDisplayValue('bulbasaur')).toBeInTheDocument();

      rerender(<SearchBar onSearch={onSearch} initialValue="charmander" />);
      expect(screen.getByDisplayValue('charmander')).toBeInTheDocument();
    });
  });
});
