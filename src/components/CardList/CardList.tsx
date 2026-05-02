import { Component, type ReactNode } from 'react';
import type { CardListProps } from '../../types';
import styles from './CardList.module.css';
import CardItem from '../CardItem/CardItem';

class CardList extends Component<CardListProps> {
  render(): ReactNode {
    return (
      <div className={styles.cardListContainer}>
        {(this.props.items ?? []).map((item) => (
          <CardItem
            key={item.name}
            name={item.name}
            type={item.types[0].type.name}
            weight={item.weight}
            ability={item.abilities[0].ability.name}
            image={item.sprites.front_default}
          />
        ))}
      </div>
    );
  }
}
export default CardList;
