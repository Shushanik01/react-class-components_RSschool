import type { SearchProps } from '../../types';
import styles from './SearchBar.module.css';
import { KEYBOARD_KEYS } from '../../constants';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useEffect } from 'react';

const SearchBar = (props: SearchProps) => {
  const [storedValue, setStoredValue] = useLocalStorage('searchTerm');

  useEffect(() => {
    if (storedValue) {
      props.onSearch(storedValue);
    }
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setStoredValue(e.target.value);
  };

  const handleSearch = (): void => {
    const trimmedValue = storedValue.trim();
    setStoredValue(trimmedValue);
    props.onSearch(trimmedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEYBOARD_KEYS.Enter) {
      handleSearch();
    }
  };
  return (
    <div className={styles.searchbarContainer}>
      <input
        type="text"
        value={storedValue}
        onChange={handleInputChange}
        placeholder="Search..."
        className={styles.searchInput}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch} className={styles.searchBtn}>
        <svg viewBox="0 0 24 24" className={styles.searchIcon}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Search
      </button>
    </div>
  );
};
export default SearchBar;
