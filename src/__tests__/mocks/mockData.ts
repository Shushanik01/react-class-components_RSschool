import type { Item } from '../../types';

export const mockItem: Item = {
  id: 1,
  name: 'bulbasaur',
  weight: 69,
  types: [{ type: { name: 'grass' } }],
  abilities: [{ ability: { name: 'overgrow' } }],
  sprites: { front_default: 'https://example.com/bulbasaur.png' },
};

export const mockItems: Item[] = [
  mockItem,
  {
    id: 4,
    name: 'charmander',
    weight: 85,
    types: [{ type: { name: 'fire' } }],
    abilities: [{ ability: { name: 'blaze' } }],
    sprites: { front_default: 'https://example.com/charmander.png' },
  },
];
