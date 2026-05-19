import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardItem from '../components/CardItem/CardItem';

const onCardClick = vi.fn();

const defaultProps = {
  id: 1,
  name: 'bulbasaur',
  type: 'grass',
  weight: 69,
  ability: 'overgrow',
  image: 'https://example.com/bulbasaur.png',
  onCardClick,
};

describe('CardItem', () => {
  it('displays the pokemon name', () => {
    render(<CardItem {...defaultProps} />);
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
  });

  it('displays the pokemon type', () => {
    render(<CardItem {...defaultProps} />);
    expect(screen.getByText(/grass/i)).toBeInTheDocument();
  });

  it('displays the pokemon weight', () => {
    render(<CardItem {...defaultProps} />);
    expect(screen.getByText(/69/)).toBeInTheDocument();
  });

  it('displays the pokemon ability', () => {
    render(<CardItem {...defaultProps} />);
    expect(screen.getByText(/overgrow/i)).toBeInTheDocument();
  });

  it('renders the image with correct src and alt', () => {
    render(<CardItem {...defaultProps} />);
    const img = screen.getByRole('img', { name: /bulbasaur/i });
    expect(img).toHaveAttribute('src', 'https://example.com/bulbasaur.png');
    expect(img).toHaveAttribute('alt', 'bulbasaur');
  });

  it('renders without crashing when weight is zero', () => {
    render(<CardItem {...defaultProps} weight={0} />);
    expect(screen.getByText(/0/)).toBeInTheDocument();
  });

  it('calls onCardClick with the correct id when View Details is clicked', async () => {
    const user = userEvent.setup();
    render(<CardItem {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /view details/i }));
    expect(onCardClick).toHaveBeenCalledWith(1);
  });
});
