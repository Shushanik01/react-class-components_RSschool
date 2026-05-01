import SearchBar from './components/SearchBar/SearchBar'
import './App.css'
import { Component, Fragment } from 'react';
import type { AppState } from './types';
import CardList from './components/CardList/CardList';
import { getData, getAllData } from './services/api';

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
    this.setState({loading: true})
    try {
      const data = await getAllData();
      
      this.setState({items: data, loading: false})
    } catch (error){
      this.setState({error: (error as Error).message, loading:false})
    }
  }

  handleSearch = async (term: string): Promise<void> => {
    this.setState({ loading: true });
    try {
      const data = await getData(term);
      console.log(data);
      
      this.setState({ items: [data], loading: false });
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
        <CardList items={this.state.items} />
      </Fragment>
    )
  }
}
export default App
