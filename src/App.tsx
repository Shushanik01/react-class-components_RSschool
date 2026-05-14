import SearchBar from './components/SearchBar/SearchBar';
import styles from './App.module.css';
import { Fragment, useEffect, useState } from 'react';
import CardList from './components/CardList/CardList';
import { getStoredSearchTerm, setStoredSearchTerm } from './utils/localStorage';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import TestButton from './components/testButton/testButton';
import { useSearchParams } from 'react-router';
import { usePagination } from './hooks/usePagination';
import Pagination from './components/pagination/Pagination';

const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(getStoredSearchTerm());
  const initialPage = Number(searchParams.get('page')) || 1;

  const {
    items,
    loading,
    error,
    currentPage,
    totalPages,
    goToPage,
    resetPage,
  } = usePagination(searchTerm, initialPage);

  useEffect(() => {
    setSearchParams({ page: currentPage.toString() });
  }, [currentPage, setSearchParams]);

  const handleSearch = (rawTerm: string) => {
    const term = rawTerm.trim();
    setSearchTerm(term);
    setStoredSearchTerm(term);
    resetPage();
  };

  return (
    <Fragment>
      <SearchBar onSearch={handleSearch} initialValue={searchTerm} />

      {error && <p className={styles.errorBanner}>{error}</p>}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <CardList items={items} />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          )}
        </>
      )}

      <TestButton />
    </Fragment>
  );
};
export default App;
