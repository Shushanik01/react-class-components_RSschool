import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RouteError from '../router/RouteError';

const mockUseRouteError = vi.hoisted(() => vi.fn());
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useRouteError: mockUseRouteError };
});

describe('RouteError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouteError.mockReturnValue(new Error('Something broke'));
  });

  it('renders Something went wrong heading', () => {
    render(<RouteError />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('renders the error message from useRouteError', () => {
    render(<RouteError />);
    expect(screen.getByText('Something broke')).toBeInTheDocument();
  });

  it('renders default message when error has no message', () => {
    mockUseRouteError.mockReturnValue({});
    render(<RouteError />);
    expect(
      screen.getByText('An unexpected error occurred')
    ).toBeInTheDocument();
  });

  it('renders the Reload Page button', () => {
    render(<RouteError />);
    expect(
      screen.getByRole('button', { name: /reload page/i })
    ).toBeInTheDocument();
  });

  it('calls window.location.reload when Reload Page is clicked', async () => {
    const user = userEvent.setup();
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });
    render(<RouteError />);
    await user.click(screen.getByRole('button', { name: /reload page/i }));
    expect(reloadMock).toHaveBeenCalled();
  });
});
