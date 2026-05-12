import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders the loading indicator', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has an accessible aria-label', () => {
    render(<LoadingSpinner />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
