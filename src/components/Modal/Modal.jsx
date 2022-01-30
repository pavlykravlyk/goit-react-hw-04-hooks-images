import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export default function Modal({ onClose, children }) {
  const handleOverlayClick = ({ currentTarget, target }) => {
    currentTarget === target && onClose();
  };

  useEffect(() => {
    const handleKeyDown = ({ code }) => code === 'Escape' && onClose();

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div className={styles.Overlay} onClick={handleOverlayClick}>
      <div className={styles.Modal}>{children}</div>
    </div>,
    document.querySelector('#modal-root'),
  );
}
