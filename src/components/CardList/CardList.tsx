import { Component, type ReactNode } from "react";
import type { CardListProps } from "../../types";
import styles from './CardList.module.css'

class CardList extends Component<CardListProps> {
    render(): ReactNode {
        return (
            <div className={styles.cardListContainer}>
                {this.props.items.map((item) => (
                    <div key={item.id}>{item.name}</div>
                ))}
            </div>
        )
    }
}
export default CardList