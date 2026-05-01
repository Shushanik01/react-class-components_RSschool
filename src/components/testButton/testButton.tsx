import { Component, type ReactNode } from 'react';
import styles from './testButton.module.css';

type testButtonProps = {
    onClick: ()=> void
};

class TestButton extends Component<testButtonProps>{
    render(): ReactNode {
        return(
            <button onClick={this.props.onClick} className={styles.testErrorBtn}>
                Test Error
            </button>
        )
    }
}
export default TestButton