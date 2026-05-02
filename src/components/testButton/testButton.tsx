import { Component, type ReactNode } from 'react';
import styles from './testButton.module.css';

type TestButtonState = { shouldThrow: boolean };

class TestButton extends Component<object, TestButtonState> {
  state: TestButtonState = { shouldThrow: false };

  handleClick = (): void => {
    this.setState({ shouldThrow: true });
  };

  render(): ReactNode {
    if (this.state.shouldThrow) throw new Error('Test error');
    return (
      <button onClick={this.handleClick} className={styles.testErrorBtn}>
        Test Error
      </button>
    );
  }
}
export default TestButton