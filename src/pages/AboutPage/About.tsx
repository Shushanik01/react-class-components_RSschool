import { Fragment } from 'react';
import styles from './style.module.css';
import githubIcon from '../../assets/githubIcon.webp';
import linkedin from '../../assets/linkedin.jpg';

const About = () => {
  return (
    <Fragment>
      <div className={styles.container}>
        <h1 className={styles.header}>About the author</h1>

        <p className={styles.introText}>
          Hi! <br />
          My name is <span>Shushanik</span>, I am a junior frontend developer
          intern at <span>Epam Systems</span>
        </p>

        <div className={styles.divider} />

        <span className={styles.socialsTitle}>Check out my socials below!</span>

        <div className={styles.socialLinks}>
          <a
            href="https://github.com/Shushanik01"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={githubIcon} alt="github icon" />
          </a>
          <a
            href="https://www.linkedin.com/in/shushanik-arakelyan-4b763b365/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={linkedin} alt="linkedin" />
          </a>
        </div>

        <div className={styles.portfolioSection}>
          <p>🌟 Portfolio:</p>
          <a
            href="https://portfolio-khaki-alpha-76.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.portfolioLink}
          >
            View My Portfolio →
          </a>
        </div>

        <div className={styles.rsLink}>
          <a
            href="https://github.com/rolling-scopes-school/tasks/tree/master/react"
            target="_blank"
            rel="noopener noreferrer"
          >
            📚 Go to the RS School React course
          </a>
        </div>
      </div>
    </Fragment>
  );
};

export default About;
