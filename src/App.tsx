import SearchBar from './components/SearchBar/SearchBar';
import styles from './App.module.css';
import { Fragment, useCallback, useEffect, useState } from 'react';
import type { AppState } from './types';
import CardList from './components/CardList/CardList';
import { getData } from './services/api';
import { getStoredSearchTerm, setStoredSearchTerm } from './utils/localStorage';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import TestButton from './components/testButton/testButton';

const LOADING_DELAY_MS = 500;

function App() {
  const [state, setState] = useState<AppState>({
    searchTerm: getStoredSearchTerm(),
    items: [],
    loading: false,
    error: null,
  });

  const fetchWithLoading = useCallback(
    async (operation: () => Promise<void>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await new Promise((resolve) => setTimeout(resolve, LOADING_DELAY_MS));
      try {
        await operation();
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: (error as Error).message,
          loading: false,
        }));
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    []
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      const term = getStoredSearchTerm();
      await fetchWithLoading(async () => {
        const data = term ? await getData(term) : null;
        setState({
          searchTerm: term,
          items: term ? [data] : data,
          loading: false,
          error: null,
        });
      });
    };
    fetchInitialData();
  }, [fetchWithLoading]);

  const handleSearch = useCallback(
    async (rawTerm: string) => {
      const term = rawTerm.trim();

      if (term === state.searchTerm) return;

      setStoredSearchTerm(term);

      await fetchWithLoading(async () => {
        const data = term ? await getData(term) : null;
        setState({
          searchTerm: term,
          items: term ? [data] : data,
          loading: false,
          error: null,
        });
      });
    },
    [state.searchTerm, fetchWithLoading]
  );
  return (
    <Fragment>
      <SearchBar onSearch={handleSearch} initialValue={state.searchTerm} />
      {state.error && <p className={styles.errorBanner}>{state.error}</p>}
      {state.loading ? <LoadingSpinner /> : <CardList items={state.items} />}
      <TestButton />
    </Fragment>
  );
}
export default App;
