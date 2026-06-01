import styles from './Flyout.module.css';

interface FlyoutProps {
  selectedCount: number;
  onUnselectAll: () => void;
  onDownload: () => void;
}

const Flyout = ({ selectedCount, onUnselectAll, onDownload }: FlyoutProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className={styles.flyout}>
      <span className={styles.count}>
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </span>
      <div className={styles.actions}>
        <button className={styles.unselectBtn} onClick={onUnselectAll}>
          Unselect all
        </button>
        <button className={styles.downloadBtn} onClick={onDownload}>
          Download
        </button>
      </div>
    </div>
  );
};

export default Flyout;
