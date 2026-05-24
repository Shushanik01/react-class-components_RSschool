import { useState } from 'react';
import { Outlet, useNavigate, useMatch } from 'react-router';
import SearchBar from '../SearchBar/SearchBar';
import Pagination from '../pagination/Pagination';
import { usePagination } from '../../hooks/usePagination';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './style.module.css';
import CardList from '../CardList/CardList';
import TestButton from '../testButton/testButton';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useTheme } from '../../ThemeContext/context';
import pikachu from '../../assets/apika.png';
import gengar from '../../assets/gengar.png';

export default function Layout() {
  const detailsMatch = useMatch('/details/:id');

  const [savedTerm] = useLocalStorage('searchTerm');
  const [searchTerm, setSearchTerm] = useState(savedTerm || '');
  const { items, loading, error, currentPage, totalPages, goToPage } =
    usePagination(searchTerm);

  const navigate = useNavigate();

  const handleCardClick = (pokemonId: number) => {
    navigate(`/details/${pokemonId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const { theme, handleThemeChange } = useTheme();

  return (
    <div className={styles.splitLayout}>
      <button className={styles.themeToggleBtn} onClick={handleThemeChange}>
        <img
          src={theme === 'Light' ? pikachu : gengar}
          alt="pikachu ang gengar"
        />
      </button>
      <div className={styles.leftSection}>
        <SearchBar initialValue={searchTerm} onSearch={setSearchTerm} />
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p>{error}</p>
        ) : (
          <CardList items={items} onCardClick={handleCardClick} />
        )}
        {!loading && items.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        )}

        <TestButton />
        <button className={styles.aboutBtn} onClick={() => navigate('/about')}>
          About
        </button>
      </div>
      {detailsMatch && (
        <div className={styles.rightSection}>
          <Outlet />
        </div>
      )}
    </div>
  );
}
