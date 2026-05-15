import { useRouteError } from 'react-router';
import styles from '../components/ErrorBoundary/ErrorBoundary.module.css';

const RouteError = () => {
  const error = useRouteError() as Error;

  return (
    <div className={styles.fallbackContainer}>
      <span className={styles.fallbackIcon}>⚠️</span>
      <h2>Something went wrong!</h2>
      <p>{error?.message ?? 'An unexpected error occurred'}</p>
      <button className={styles.fallbackBtn} onClick={() => window.location.reload()}>
        Reload Page
      </button>
    </div>
  );
};

export default RouteError;
