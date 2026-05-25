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
import { toggleItem, clearAll } from '../../slices/selectedItemsSlice';
import { getData } from '../../services/api';
import Flyout from '../Flyout/Flyout';
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
  const { selectedIds } = useAppSelector((state) => state.selectedItems);
  const { theme, handleThemeChange } = useTheme();

  useEffect(() => {
    setSearchParams({ page: String(currentPage) }, { replace: true });
    dispatch(fetchPokemonList({ searchTerm, page: currentPage }));
  }, [searchTerm, currentPage]);

  const handleCardClick = (pokemonId: number) => {
    navigate(`/details/${pokemonId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSelect = (id: number) => {
    dispatch(toggleItem(id));
  };

  const handleUnselectAll = () => {
    dispatch(clearAll());
  };

  const handleDownload = async () => {
    const cachedById = new Map(items.map((item) => [item.id, item]));

    const pokemonData = await Promise.all(
      selectedIds.map((id) =>
        cachedById.has(id)
          ? Promise.resolve(cachedById.get(id)!)
          : getData(String(id))
      )
    );

    const headers = ['id', 'name', 'type', 'weight', 'height', 'ability', 'description', 'details_url'];

    const rows = pokemonData.map((p) => {
      const type = p.types.map((t: { type: { name: string } }) => t.type.name).join('/');
      const ability = p.abilities[0]?.ability.name ?? '';
      const description = p.stats
        ? p.stats.map((s: { stat: { name: string }; base_stat: number }) => `${s.stat.name}: ${s.base_stat}`).join(' | ')
        : '';
      const detailsUrl = `https://pokeapi.co/api/v2/pokemon/${p.id}`;
      return [p.id, p.name, type, p.weight, p.height ?? '', ability, description, detailsUrl]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedIds.length}_items.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
          <CardList
            items={items}
            onCardClick={handleCardClick}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
          />
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
      <Flyout
        selectedCount={selectedIds.length}
        onUnselectAll={handleUnselectAll}
        onDownload={handleDownload}
      />
    </div>
  );
}
