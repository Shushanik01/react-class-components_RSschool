import { useState } from 'react';
import { Outlet, useSearchParams } from 'react-router';
import SearchBar from '../SearchBar/SearchBar';
import Pagination from '../pagination/Pagination';
import { usePagination } from '../../hooks/usePagination';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './style.module.css';
import CardList from '../CardList/CardList';

export default function Layout() {
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get('details');
  const [searchTerm, setSearchTerm] = useState('');
  const { items, loading, currentPage, totalPages, goToPage } =
    usePagination(searchTerm);

  return (
    <div className={styles.splitLayout}>
      <div className={styles.leftSection}>
        <SearchBar initialValue={searchTerm} onSearch={setSearchTerm} />
        {loading ? <LoadingSpinner /> : <CardList items={items} />}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
      {selectedId && (
        <div className={styles.rightSection}>
          <button className={styles.closeBtn}>x</button>
          <Outlet />
        </div>
      )}
    </div>
  );
}
