import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
import { getData } from "../../services/api";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import type { Item, Stat } from "../../types";
import styles from './style.module.css'

const DetailsPannel = () => {

    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();

    const [details, setDetails] = useState<Item>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return

        const fetchDetails = async () => {
            setLoading(true);
            setError(null)

            try {
                const dataDetails = await getData(id);
                setDetails(dataDetails)
            } catch (error) {
                setError((error as Error).message)
            } finally {
                setLoading(false)
            }

        }
        fetchDetails()
    }, [id])

const handleClose = ()=>{
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('details')
    setSearchParams(newParams)
}

   return (
    <div className={styles.detailsPanel}>
      <div className={styles.header}>
        <h2>Pokémon Details</h2>
        <button onClick={handleClose} className={styles.closeBtn}>
          ✕
        </button>
      </div>
      
      {loading && (
        <div className={styles.loading}>
          <LoadingSpinner />
        </div>
      )}
      
      {error && (
        <div className={styles.error}>
          <p>Error: {error}</p>
        </div>
      )}
      
      {details && !loading && !error && (
        <div className={styles.content}>
          <img 
            src={details.sprites?.front_default} 
            alt={details.name}
            className={styles.image}
          />
          <h3 className={styles.name}>{details.name}</h3>
          
          <div className={styles.info}>
            <p><strong>Height:</strong> {details.height / 10} m</p>
            <p><strong>Weight:</strong> {details.weight / 10} kg</p>
            
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
