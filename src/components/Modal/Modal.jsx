import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export default function Modal({ onClose, children }) {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDown = ({ code }) => {
    code === 'Escape' && onClose();
  };

  const handleOverlayClick = ({ currentTarget, target }) => {
    currentTarget === target && onClose();
  };

  return createPortal(
    <div className={styles.Overlay} onClick={handleOverlayClick}>
      <div className={styles.Modal}>{children}</div>
    </div>,
    document.querySelector('#modal-root'),
  );
}
