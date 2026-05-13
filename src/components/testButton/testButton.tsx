import { useState } from 'react';
import styles from './testButton.module.css';

const TestButton = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) throw new Error('Test error');

  return (
    <button onClick={() => setShouldThrow(true)} className={styles.testErrorBtn}>
      Test Error
    </button>
  );
};
export default TestButton;
