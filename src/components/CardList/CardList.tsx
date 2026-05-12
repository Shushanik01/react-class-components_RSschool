import { Component, type ReactNode } from 'react';
import type { CardListProps } from '../../types';
import styles from './CardList.module.css';
import CardItem from '../CardItem/CardItem';

class CardList extends Component<CardListProps> {
  render(): ReactNode {
    return (
      <ul className={styles.cardListContainer}>
        {(this.props.items ?? []).length === 0 && (
          <p>No results found</p>
        )}
        {(this.props.items ?? []).map((item) => (
          <li key={item.name}>
            <CardItem
              name={item.name}
              type={item.types[0].type.name}
              weight={item.weight}
              ability={item.abilities[0].ability.name}
              image={item.sprites.front_default}
            />
          </li>
        ))}
      </ul>
    );
  }
}
export default CardList;
