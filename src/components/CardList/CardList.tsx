import type { CardListProps } from '../../types';
import styles from './CardList.module.css';
import CardItem from '../CardItem/CardItem';

const CardList = (props: CardListProps) => {
  return (
    <ul className={styles.cardListContainer}>
      {(props.items ?? []).length === 0 && <p>No results found</p>}
      {(props.items ?? []).map((item) => (
        <li key={item.name}>
          <CardItem
            id={item.id}
            name={item.name}
            type={item.types[0].type.name}
            weight={item.weight}
            ability={item.abilities[0].ability.name}
            image={item.sprites.front_default}
            isSelected={props.selectedIds.includes(item.id)}
            onCardClick={props.onCardClick}
            onToggleSelect={props.onToggleSelect}
          />
        </li>
      ))}
    </ul>
  );
};
export default CardList;
