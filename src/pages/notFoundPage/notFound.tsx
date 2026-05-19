import { Fragment } from 'react';
import { useNavigate } from 'react-router';
import styles from './style.module.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Fragment>
      <div className={styles.container}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.errorMessage}>Page not found!</h2>
        <p className={styles.description}>
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <button className={styles.homeButton} onClick={() => navigate('/')}>
          Return to the main page
        </button>
      </div>
    </Fragment>
  );
};

export default NotFound;
