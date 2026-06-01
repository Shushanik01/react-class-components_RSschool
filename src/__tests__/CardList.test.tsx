import { render, screen } from '@testing-library/react';
import CardList from '../components/CardList/CardList';
import { mockItems } from './mocks/mockData';
import type { Item } from '../types';

const noop = () => {};

describe('CardList', () => {
  it('renders the correct number of items', () => {
    render(
      <CardList
        items={mockItems}
        onCardClick={noop}
        selectedIds={[]}
        onToggleSelect={noop}
      />
    );
    const items = screen.getAllByRole('article');
    expect(items).toHaveLength(mockItems.length);
  });

  it('displays each pokemon name', () => {
    render(
      <CardList
        items={mockItems}
        onCardClick={noop}
        selectedIds={[]}
        onToggleSelect={noop}
      />
    );
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/charmander/i)).toBeInTheDocument();
  });

  it('shows "No results found" when items array is empty', () => {
    render(
      <CardList
        items={[]}
        onCardClick={noop}
        selectedIds={[]}
        onToggleSelect={noop}
      />
    );
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders without crashing when items is an empty array', () => {
    const { container } = render(
      <CardList
        items={[]}
        onCardClick={noop}
        selectedIds={[]}
        onToggleSelect={noop}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('renders a single item correctly', () => {
    render(
      <CardList
        items={[mockItems[0]]}
        onCardClick={noop}
        selectedIds={[]}
        onToggleSelect={noop}
      />
    );
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
  });

  it('displays type for each item', () => {
    render(
      <CardList
        items={mockItems}
        onCardClick={noop}
        selectedIds={[]}
        onToggleSelect={noop}
      />
    );
    expect(screen.getByText(/grass/i)).toBeInTheDocument();
    expect(screen.getByText(/fire/i)).toBeInTheDocument();
  });

  it('handles items with missing optional data gracefully', () => {
    const itemWithMinimalData: Item = {
      id: 99,
      name: 'testmon',
      weight: 0,
      types: [{ type: { name: 'normal' } }],
      abilities: [{ ability: { name: 'run-away' } }],
      sprites: { front_default: '' },
    };
    render(
      <CardList
        items={[itemWithMinimalData]}
        onCardClick={noop}
        selectedIds={[]}
        onToggleSelect={noop}
      />
    );
    expect(screen.getByText(/testmon/i)).toBeInTheDocument();
  });

  it('shows "No results found" when items is null', () => {
    render(
      <CardList
        items={null as unknown as Item[]}
        onCardClick={noop}
        selectedIds={[]}
        onToggleSelect={noop}
      />
    );
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('shows "No results found" when items is undefined', () => {
    render(
      <CardList
        items={undefined as unknown as Item[]}
        onCardClick={noop}
        selectedIds={[]}
        onToggleSelect={noop}
      />
    );
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });
});
