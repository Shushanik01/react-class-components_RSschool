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
import { setSearchTerm, setCurrentPage } from '../../slices/pokemonListSlice';
import { toggleItem, clearAll } from '../../slices/selectedItemsSlice';
import type { Item } from '../../types';
import Flyout from '../Flyout/Flyout';
import pikachu from '../../assets/apika.png';
import gengar from '../../assets/gengar.png';
import {
  pokemonApi,
  useGetAllPokemonsQuery,
  useGetSinglePokemonQuery,
} from '../../api/api';
import RefreshBtn from '../refreshBtn/refreshBtn';

export default function Layout() {
  const detailsMatch = useMatch('/details/:id');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [, setSearchParams] = useSearchParams();

  const { currentPage, searchTerm } = useAppSelector(
    (state) => state.pokemonList
  );
  const isSearching = !!searchTerm.trim();
  const {
    data: allData,
    isLoading: allLoading,
    isFetching: allFetching,
    error: allError,
  } = useGetAllPokemonsQuery(
    { offset: (currentPage - 1) * 20, limit: 20 },
    { skip: isSearching }
  );
  const {
    data: singleData,
    isLoading: singleLoading,
    isFetching: singleFetching,
    error: singleError,
  } = useGetSinglePokemonQuery(searchTerm.trim(), { skip: !isSearching });

  const data = isSearching
    ? singleData
      ? { results: [singleData], count: 1 }
      : undefined
    : allData;
  const isLoading = isSearching
    ? singleLoading || singleFetching
    : allLoading || allFetching;
  const error = isSearching ? singleError : allError;

  const items = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / 20) : 0;
  const { selectedIds } = useAppSelector((state) => state.selectedItems);
  const { theme, handleThemeChange } = useTheme();

  useEffect(() => {
    setSearchParams({ page: String(currentPage) }, { replace: true });
  }, [currentPage]);

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

    const resolved = await Promise.all(
      selectedIds.map((id) =>
        cachedById.has(id)
          ? Promise.resolve(cachedById.get(id)!)
          : dispatch(
              pokemonApi.endpoints.getSinglePokemon.initiate(String(id))
            ).then((result) => result.data)
      )
    );
    const pokemonData = resolved.filter((p): p is Item => p !== undefined);

    const headers = [
      'id',
      'name',
      'type',
      'weight',
      'height',
      'ability',
      'description',
      'details_url',
    ];

    const rows = pokemonData.map((p) => {
      const type = p.types
        .map((t: { type: { name: string } }) => t.type.name)
        .join('/');
      const ability = p.abilities[0]?.ability.name ?? '';
      const description = p.stats
        ? p.stats
            .map(
              (s: { stat: { name: string }; base_stat: number }) =>
                `${s.stat.name}: ${s.base_stat}`
            )
            .join(' | ')
        : '';
      const detailsUrl = `https://pokeapi.co/api/v2/pokemon/${p.id}`;
      return [
        p.id,
        p.name,
        type,
        p.weight,
        p.height ?? '',
        ability,
        description,
        detailsUrl,
      ]
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
          alt="pikachu and gengar"
        />
      </button>
      
      <div className={styles.leftSection}>
        <div className={styles.searchRow}>
          <SearchBar
            initialValue={searchTerm}
            onSearch={(term) => dispatch(setSearchTerm(term))}
          />
          <RefreshBtn />
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <p>{'message' in error ? error.message : 'Failed to load pokemon'}</p>
        ) : (
          <CardList
            items={items}
            onCardClick={handleCardClick}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
          />
        )}
        {!isLoading && items.length > 0 && (
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
