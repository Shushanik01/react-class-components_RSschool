import { useState } from 'react';
import type { SearchProps } from '../../types';
import styles from './SearchBar.module.css';
import { KEYBOARD_KEYS } from '../../constants';

const SearchBar = (props: SearchProps) => {
  const [inputValue, setInputValue] = useState<string>(
    props.initialValue || ''
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleSearch = (): void => {
    const rawValue = inputValue;
    const trimmedValue = rawValue.trim();
    setInputValue(trimmedValue);
    props.onSearch(rawValue);
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
        value={inputValue}
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
