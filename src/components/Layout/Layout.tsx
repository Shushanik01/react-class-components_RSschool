import { useState } from 'react';
import { Outlet, useNavigate, useMatch } from 'react-router';
import SearchBar from '../SearchBar/SearchBar';
import Pagination from '../pagination/Pagination';
import { usePagination } from '../../hooks/usePagination';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './style.module.css';
import CardList from '../CardList/CardList';
import TestButton from '../testButton/testButton';

export default function Layout() {
  const detailsMatch = useMatch('/details/:id');
  const [searchTerm, setSearchTerm] = useState('');
  const { items, loading, currentPage, totalPages, goToPage } =
    usePagination(searchTerm);

  const navigate = useNavigate();

  const handleCardClick = (pokemonId: number) => {
    navigate(`/details/${pokemonId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.splitLayout}>
      <div className={styles.leftSection}>
        <SearchBar initialValue={searchTerm} onSearch={setSearchTerm} />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <CardList items={items} onCardClick={handleCardClick} />
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
        <TestButton />
        <button onClick={() => navigate('/about')}>About</button>
      </div>
      {detailsMatch && (
        <div className={styles.rightSection}>
          <Outlet />
        </div>
      )}
    </div>
  );
}
