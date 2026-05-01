import { Component, type ReactNode } from "react";
import type { SearchProps, SearchState } from "../../types";
import styles from './SearchBar.module.css'


class SearchBar extends Component<SearchProps, SearchState> {
    constructor(props: SearchProps) {
        super(props)
        this.state = {
            inputValue: props.initialValue || '',
            hasError: false
        }
    }
    handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({ inputValue: e.target.value })
    };

    handleSearch = (): void => {
        const trimmedValue = this.state.inputValue.trim();
        this.setState({ inputValue: trimmedValue })
        this.props.onSearch(trimmedValue)
    };

    handleTestError = (): void => {
        this.setState({ hasError: true })
    };
    render(): ReactNode {
        if (this.state.hasError) {
            throw new Error('Test Error from error boundary')
        }
        return (
            <div className={styles.searchbarContainer}>
                <input
                type="text"
                value={this.state.inputValue}
                onChange={this.handleInputChange}
                placeholder="Search..."
                className={styles.searchInput}
                />
                <button
                onClick={this.handleSearch}
                className={styles.searchBtn}
                >
                  <svg viewBox="0 0 24 24" className={styles.searchIcon}>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Search
                </button>
            </div>
        )
    };
}
export default SearchBar