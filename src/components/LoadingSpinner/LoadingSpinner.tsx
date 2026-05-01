import { Component } from 'react';
import styles from './LoadingSpinner.module.css';

class LoadingSpinner extends Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.spinner}></div>
      </div>
    );
  }
}

export default LoadingSpinner;
