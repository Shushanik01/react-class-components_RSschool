import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardList from './CardList';
import type { Item } from '../../types';

const mockItem: Item = {
  id: 1,
  name: 'bulbasaur',
  weight: 69,
  types: [{ type: { name: 'grass' } }],
  abilities: [{ ability: { name: 'overgrow' } }],
  sprites: { front_default: 'https://example.com/bulbasaur.png' },
};

const secondItem: Item = {
  id: 4,
  name: 'charmander',
  weight: 85,
  types: [{ type: { name: 'fire' } }],
  abilities: [{ ability: { name: 'blaze' } }],
  sprites: { front_default: 'https://example.com/charmander.png' },
};

describe('CardList', () => {
  it('shows "No results found" when items array is empty', () => {
    render(
      <CardList
        items={[]}
        onCardClick={vi.fn()}
        selectedIds={[]}
        onToggleSelect={vi.fn()}
      />
    );
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders a card for each item', () => {
    render(
      <CardList
        items={[mockItem, secondItem]}
        onCardClick={vi.fn()}
        selectedIds={[]}
        onToggleSelect={vi.fn()}
      />
    );
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/charmander/i)).toBeInTheDocument();
  });

  it('marks the correct item as selected via selectedIds', () => {
    render(
      <CardList
        items={[mockItem, secondItem]}
        onCardClick={vi.fn()}
        selectedIds={[4]}
        onToggleSelect={vi.fn()}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });

  it('calls onCardClick with correct id when a card is clicked', async () => {
    const onCardClick = vi.fn();
    render(
      <CardList
        items={[mockItem]}
        onCardClick={onCardClick}
        selectedIds={[]}
        onToggleSelect={vi.fn()}
      />
    );
    await userEvent.click(screen.getByText('View Details'));
    expect(onCardClick).toHaveBeenCalledWith(1);
  });

  it('calls onToggleSelect with correct id when checkbox is clicked', async () => {
    const onToggleSelect = vi.fn();
    render(
      <CardList
        items={[mockItem]}
        onCardClick={vi.fn()}
        selectedIds={[]}
        onToggleSelect={onToggleSelect}
      />
    );
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onToggleSelect).toHaveBeenCalledWith(1);
  });
});
