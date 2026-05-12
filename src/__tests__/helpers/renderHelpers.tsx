import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

export const renderWithErrorBoundary = (ui: ReactElement) => {
  return render(<ErrorBoundary>{ui}</ErrorBoundary>);
};
