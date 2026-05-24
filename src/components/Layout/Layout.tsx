import { useEffect } from 'react';
import { Outlet, useNavigate, useMatch, useSearchParams } from 'react-router';
import SearchBar from '../SearchBar/SearchBar';
import Pagination from '../pagination/Pagination';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './style.module.css';
import CardList from '../CardList/CardList';
import TestButton from '../testButton/testButton';
import { useTheme } from '../../ThemeContext/context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchPokemonList,
  setSearchTerm,
  setCurrentPage,
  selectTotalPages,
} from '../../slices/pokemonListSlice';
import pikachu from '../../assets/apika.png';
import gengar from '../../assets/gengar.png';

export default function Layout() {
  const detailsMatch = useMatch('/details/:id');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [, setSearchParams] = useSearchParams();

  const { items, loading, error, currentPage, searchTerm } = useAppSelector(
    (state) => state.pokemonList
  );
  const totalPages = useAppSelector(selectTotalPages);
  const { theme, handleThemeChange } = useTheme();

  useEffect(() => {
    setSearchParams({ page: String(currentPage) }, { replace: true });
    dispatch(fetchPokemonList({ searchTerm, page: currentPage }));
  }, [searchTerm, currentPage]);

  const handleCardClick = (pokemonId: number) => {
    navigate(`/details/${pokemonId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.splitLayout}>
      <button className={styles.themeToggleBtn} onClick={handleThemeChange}>
        <img
          src={theme === 'Light' ? pikachu : gengar}
          alt="pikachu ang gengar"
        />
      </button>
      <div className={styles.leftSection}>
        <SearchBar
          initialValue={searchTerm}
          onSearch={(term) => dispatch(setSearchTerm(term))}
        />
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
            onPageChange={(page) => dispatch(setCurrentPage(page))}
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
