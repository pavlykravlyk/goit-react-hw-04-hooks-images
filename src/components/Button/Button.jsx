import styles from './Button.module.css';

export default function LoadMoreBtn({ onLoadMore }) {
  return (
    <button onClick={onLoadMore} type="button" className={styles.Button}>
      load more
    </button>
  );
}
