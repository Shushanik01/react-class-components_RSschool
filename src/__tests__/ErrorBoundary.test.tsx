import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import TestButton from '../components/testButton/testButton';

const ThrowingComponent = ({
  message = 'Test error message',
}: {
  message?: string;
}) => {
  throw new Error(message);
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Normal rendering', () => {
    it('renders children when there is no error', () => {
      render(
        <ErrorBoundary>
          <p>Child content</p>
        </ErrorBoundary>
      );
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('does not show fallback UI when there is no error', () => {
      render(
        <ErrorBoundary>
          <p>Child content</p>
        </ErrorBoundary>
      );
      expect(
        screen.queryByText('Something went wrong!')
      ).not.toBeInTheDocument();
    });
  });

  describe('Error catching', () => {
    it('displays fallback UI when a child component throws', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });

    it('displays the error message in the fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent message="Custom error text" />
        </ErrorBoundary>
      );
      expect(screen.getByText('Custom error text')).toBeInTheDocument();
    });

    it('logs the error to console', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );
      expect(console.error).toHaveBeenCalled();
    });

    it('shows a Reload Page button in the fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );
      expect(
        screen.getByRole('button', { name: /reload page/i })
      ).toBeInTheDocument();
    });

    it('calls window.location.reload when Reload Page is clicked', async () => {
      const user = userEvent.setup();
      const reloadMock = vi.fn();
      vi.stubGlobal('location', { reload: reloadMock });

      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      await user.click(screen.getByRole('button', { name: /reload page/i }));
      expect(reloadMock).toHaveBeenCalledTimes(1);

      vi.unstubAllGlobals();
    });
  });

  describe('TestButton integration', () => {
    it('renders the Test Error button', () => {
      render(
        <ErrorBoundary>
          <TestButton />
        </ErrorBoundary>
      );
      expect(
        screen.getByRole('button', { name: /test error/i })
      ).toBeInTheDocument();
    });

    it('triggers fallback UI when Test Error button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ErrorBoundary>
          <TestButton />
        </ErrorBoundary>
      );

      await user.click(screen.getByRole('button', { name: /test error/i }));
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      expect(screen.getByText('Test error')).toBeInTheDocument();
    });
  });
});
