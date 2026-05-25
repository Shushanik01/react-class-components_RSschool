import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the search input', () => {
    render(<SearchBar initialValue="" onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders the Search button', () => {
    render(<SearchBar initialValue="" onSearch={vi.fn()} />);
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('calls onSearch with typed value when button is clicked', async () => {
    const onSearch = vi.fn();
    render(<SearchBar initialValue="" onSearch={onSearch} />);
    await userEvent.type(screen.getByPlaceholderText('Search...'), 'pikachu');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearch).toHaveBeenCalledWith('pikachu');
  });

  it('calls onSearch with typed value when Enter is pressed', async () => {
    const onSearch = vi.fn();
    render(<SearchBar initialValue="" onSearch={onSearch} />);
    await userEvent.type(screen.getByPlaceholderText('Search...'), 'pikachu{Enter}');
    expect(onSearch).toHaveBeenCalledWith('pikachu');
  });

  it('trims whitespace before calling onSearch', async () => {
    const onSearch = vi.fn();
    render(<SearchBar initialValue="" onSearch={onSearch} />);
    await userEvent.type(screen.getByPlaceholderText('Search...'), '  pikachu  ');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearch).toHaveBeenCalledWith('pikachu');
  });

  it('calls onSearch on mount if localStorage has a stored value', () => {
    localStorage.setItem('searchTerm', 'eevee');
    const onSearch = vi.fn();
    render(<SearchBar initialValue="" onSearch={onSearch} />);
    expect(onSearch).toHaveBeenCalledWith('eevee');
  });

  it('does not call onSearch on mount when localStorage is empty', () => {
    const onSearch = vi.fn();
    render(<SearchBar initialValue="" onSearch={onSearch} />);
    expect(onSearch).not.toHaveBeenCalled();
  });
});
