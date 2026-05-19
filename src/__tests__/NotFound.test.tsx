import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotFound from '../pages/notFoundPage/notFound';

const mockNavigate = vi.hoisted(() => vi.fn());
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('NotFound', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the 404 error code', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders the page not found message', () => {
    render(<NotFound />);
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });

  it('renders the return button', () => {
    render(<NotFound />);
    expect(screen.getByRole('button', { name: /return/i })).toBeInTheDocument();
  });

  it('navigates to "/" when Return button is clicked', async () => {
    const user = userEvent.setup();
    render(<NotFound />);
    await user.click(screen.getByRole('button', { name: /return/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
