import type { CardItemProps } from '../../types';
import styles from './CardItem.module.css';

const CardItem = (props: CardItemProps) => {
  return (
    <article
      className={styles.container}
      onClick={() => props.onCardClick(props.id)}
    >
      <img src={props.image} alt={props.name} width={120} height={120} />
      <section>
        <h3> Name: {props.name}</h3>
        <p>Type: {props.type}</p>
        <p>Weight: {props.weight}</p>
        <p>Ability: {props.ability}</p>
      </section>
    </article>
  );
};
export default CardItem;
