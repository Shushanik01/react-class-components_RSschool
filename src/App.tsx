import SearchBar from './components/SearchBar/SearchBar'
import styles from './App.module.css'
import { Component, Fragment } from 'react';
import type { AppState } from './types';
import CardList from './components/CardList/CardList';
import { getData, getAllData } from './services/api';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props)
    this.state = {
      searchTerm: '',
      items: [],
      loading: false,
      error: null,
    };
  };

  async componentDidMount(): Promise<void> {
    this.setState({ loading: true });
    const keptItem = localStorage.getItem('inputValue');
    const term = keptItem ?? '';
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      const data = term ? await getData(term) : await getAllData();
      this.setState({ searchTerm: term, items: term ? [data] : data, loading: false });
    } catch (error) {
      this.setState({ error: (error as Error).message, loading: false });
    }
  }

  handleSearch = async (term: string): Promise<void> => {
    if (term === this.state.searchTerm) return
    this.setState({ loading: true, error: null });
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      const data = await getData(term);
      this.setState({ searchTerm: term, items: [data], loading: false });
    } catch (error) {
      this.setState({ error: (error as Error).message, loading: false });
    }
  }

  render() {
    return (
      <Fragment>
        <SearchBar
          onSearch={this.handleSearch}
          initialValue={this.state.searchTerm}
        />
        {this.state.error && <p className={styles.errorBanner}>{this.state.error}</p>}
     {this.state.loading ? <LoadingSpinner/> :  <CardList items={this.state.items} />}
      </Fragment>
    )
  }
}
export default App
