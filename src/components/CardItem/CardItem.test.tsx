import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardItem from './CardItem';

const defaultProps = {
  id: 1,
  name: 'bulbasaur',
  type: 'grass',
  weight: 69,
  ability: 'overgrow',
  image: 'https://example.com/bulbasaur.png',
  isSelected: false,
  onCardClick: vi.fn(),
  onToggleSelect: vi.fn(),
};

describe('CardItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pokemon name', () => {
    render(<CardItem {...defaultProps} />);
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
  });

  it('renders type, weight, and ability', () => {
    render(<CardItem {...defaultProps} />);
    expect(screen.getByText(/grass/i)).toBeInTheDocument();
    expect(screen.getByText(/69/)).toBeInTheDocument();
    expect(screen.getByText(/overgrow/i)).toBeInTheDocument();
  });

  it('renders pokemon image', () => {
    render(<CardItem {...defaultProps} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', defaultProps.image);
  });

  it('checkbox is unchecked when isSelected is false', () => {
    render(<CardItem {...defaultProps} isSelected={false} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('checkbox is checked when isSelected is true', () => {
    render(<CardItem {...defaultProps} isSelected={true} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('clicking checkbox calls onToggleSelect with item id', async () => {
    render(<CardItem {...defaultProps} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(defaultProps.onToggleSelect).toHaveBeenCalledWith(1);
  });

  it('clicking checkbox does not call onCardClick', async () => {
    render(<CardItem {...defaultProps} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(defaultProps.onCardClick).not.toHaveBeenCalled();
  });

  it('clicking "View Details" button calls onCardClick with item id', async () => {
    render(<CardItem {...defaultProps} />);
    await userEvent.click(screen.getByText('View Details'));
    expect(defaultProps.onCardClick).toHaveBeenCalledWith(1);
  });

  it('clicking "View Details" button does not call onToggleSelect', async () => {
    render(<CardItem {...defaultProps} />);
    await userEvent.click(screen.getByText('View Details'));
    expect(defaultProps.onToggleSelect).not.toHaveBeenCalled();
  });

  it('clicking the card body calls onCardClick', async () => {
    render(<CardItem {...defaultProps} />);
    await userEvent.click(screen.getByText(/Weight:/i));
    expect(defaultProps.onCardClick).toHaveBeenCalledWith(1);
  });

  it('clicking card body does not call onToggleSelect', async () => {
    render(<CardItem {...defaultProps} />);
    await userEvent.click(screen.getByText(/Weight:/i));
    expect(defaultProps.onToggleSelect).not.toHaveBeenCalled();
  });
});
