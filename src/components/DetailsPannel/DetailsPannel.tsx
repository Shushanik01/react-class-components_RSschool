import { useParams, useNavigate } from 'react-router';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import type { Stat } from '../../types';
import styles from './style.module.css';
import { useGetSinglePokemonQuery } from '../../api/api';

const DetailsPannel = () => {
  const { id } = useParams<{ id: string }>();
  const { data: details, isLoading, error } = useGetSinglePokemonQuery(id ?? '', {
      skip: !id
  });
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className={styles.detailsPanel}>
      <div className={styles.header}>
        <h2>Pokémon Details</h2>
        <button onClick={handleClose} className={styles.closeBtn}>
          ✕
        </button>
      </div>

      {isLoading && (
        <div className={styles.loading}>
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <p>Error: {'message' in error ? error.message : 'Failed to load pokemon'}</p>
        </div>
      )}

      {details && !isLoading && !error && (
        <div className={styles.content}>
          <img
            src={details.sprites?.front_default}
            alt={details.name}
            className={styles.image}
          />
          <h3 className={styles.name}>{details.name}</h3>

          <div className={styles.info}>
            <p>
              <strong>Height:</strong>{' '}
              {details.height !== undefined ? details.height / 10 : 'N/A'} m
            </p>
            <p>
              <strong>Weight:</strong> {details.weight / 10} kg
            </p>

            <div className={styles.types}>
              <strong>Types:</strong>
              {details.types?.map((t: { type: { name: string } }) => (
                <span key={t.type.name} className={styles.type}>
                  {t.type.name}
                </span>
              ))}
            </div>

            <div className={styles.abilities}>
              <strong>Abilities:</strong>
              {details.abilities?.map((a: { ability: { name: string } }) => (
                <span key={a.ability.name} className={styles.ability}>
                  {a.ability.name}
                </span>
              ))}
            </div>

            <div className={styles.stats}>
              <strong>Base Stats:</strong>
              {details.stats?.map((s: Stat) => (
                <div key={s.stat.name} className={styles.stat}>
                  <span>{s.stat.name}:</span>
                  <span>{s.base_stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPannel;
