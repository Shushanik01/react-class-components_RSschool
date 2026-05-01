import SearchBar from './components/SearchBar/SearchBar'
import './App.css'
import { Component, Fragment } from 'react';
import type { AppState } from './types';
import CardList from './components/CardList/CardList';
// import { getData, getAllData } from './services/api';

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props)
    this.state = {
      searchTerm: '',
      items: [],
      loading: false,
      error: null,
    };
  }
  handleSearch = (term: string): void => {
    this.setState({ searchTerm: term });
  };

  render() {
    return (
      <Fragment>
        <SearchBar
          onSearch={this.handleSearch}
          initialValue={this.state.searchTerm}
        />
        <CardList items={this.state.items} />
      </Fragment>
    )
  }
}
export default App
