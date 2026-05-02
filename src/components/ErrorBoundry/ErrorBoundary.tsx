import { Component, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

type ErrorBoundaryState = { error: Error | null };

class ErrorBoundary extends Component<{ children: ReactNode }> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className={styles.fallbacContainer}>
          <span className={styles.fallbacIcon}>⚠️</span>
          <h2>Something went wrong!</h2>
          <p>{this.state.error.message}</p>
          <button className={styles.fallbackBtn} onClick={this.handleReload}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
