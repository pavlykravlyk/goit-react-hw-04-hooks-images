import styles from './ImageGallery.module.css';

export default function ImageGallery({ images, onOpenModal }) {
  return (
    <ul className={styles.ImageGallery}>
      {images.map(image => (
        <li
          key={image.id}
          onClick={() => {
            onOpenModal(image);
          }}
          className={styles.ImageGalleryItem}
        >
          <img
            height={260}
            className={styles.ImageGalleryItem__image}
            src={image.webformatURL}
            alt={image.tags}
          />
        </li>
      ))}
    </ul>
  );
}
