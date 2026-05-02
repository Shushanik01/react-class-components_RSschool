import { Component, type ReactNode } from 'react';
import type { CardItemProps } from '../../types';
import styles from './CardItem.module.css';

class CardItem extends Component<CardItemProps> {
  render(): ReactNode {
    return (
      <article className={styles.container}>
        <img src={this.props.image} alt={this.props.name} width={120} height={120} />
        <section>
          <h3> Name: {this.props.name}</h3>
          <p>Type: {this.props.type}</p>
          <p>Weight: {this.props.weight}</p>
          <p>Ability: {this.props.ability}</p>
        </section>
      </article>
    );
  }
}
export default CardItem;
