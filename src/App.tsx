import SearchBar from './components/SearchBar/SearchBar'
import styles from './App.module.css'
import { Component, Fragment } from 'react';
import type { AppState } from './types';
import CardList from './components/CardList/CardList';
import { getData, getAllData } from './services/api';
import { getStoredSearchTerm } from './utils/localStorage';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import TestButton from './components/testButton/testButton';

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props)
    this.state = {
      searchTerm: '',
      items: [],
      loading: false,
      error: null,
      hasError: false
    };
  };

  private async fetchWithLoading(operation: () => Promise<void>): Promise<void> {
    this.setState({ loading: true, error: null });
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      await operation();
    } catch (error) {
      this.setState({ error: (error as Error).message, loading: false });
    }
  }

  async componentDidMount(): Promise<void> {
    const term = getStoredSearchTerm();
    await this.fetchWithLoading(async () => {
      const data = term ? await getData(term) : await getAllData();
      this.setState({ searchTerm: term, items: term ? [data] : data, loading: false });
    });
  }

  handleSearch = async (term: string): Promise<void> => {
    if (term === this.state.searchTerm) return;
    await this.fetchWithLoading(async () => {
      const data = await getData(term);
      this.setState({ searchTerm: term, items: [data], loading: false });
    });
  };
  
    handleTestError = (): void => {
      this.setState({hasError: true})
    };

  render() {
    if (this.state.hasError) {
    throw new Error('Test error');
}
    return (
      <Fragment>
        <SearchBar
          onSearch={this.handleSearch}
          initialValue={this.state.searchTerm}
        />
        {this.state.error && <p className={styles.errorBanner}>{this.state.error}</p>}
     {this.state.loading ? <LoadingSpinner/> :  <CardList items={this.state.items} />}
     <TestButton onClick={this.handleTestError}/>
      </Fragment>
    )
  }
}
export default App
