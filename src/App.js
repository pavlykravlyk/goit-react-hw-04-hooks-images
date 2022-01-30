import styles from './App.module.css';
import { useState, useEffect } from 'react';
import { animateScroll as scroll } from 'react-scroll';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'react-loader-spinner';
import Modal from './components/Modal';
import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import Button from './components/Button';
import API from './services/pixabay-api';

export default function App() {
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [currImg, setCurrImg] = useState({});
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const findImageByName = async () => {
      try {
        const response = await API(query, page);
        setImages(response);
        setStatus('resolved');
      } catch (error) {
        setError(error);
        setStatus('rejected');
        toast.error(error);
      }
    };

    if (query) {
      setStatus('pending');
      setPage(1);
      findImageByName();
    }
  }, [query]);

  useEffect(() => {
    const findImageByName = async () => {
      try {
        const response = await API(query, page);
        setImages(state => [...state, ...response]);
        setStatus('resolved');
      } catch (error) {
        setError(error);
        setStatus('rejected');
        toast.error(error);
      }
    };

    if (page > 1) {
      setStatus('pending');
      findImageByName();
    }
  }, [page]);

  useEffect(() => {
    status === 'resolved' && scroll.scrollToBottom();
  }, [status]);

  const toggleModal = image => {
    setShowModal(!showModal);
    setCurrImg(image);
  };

  return (
    <div className={styles.App}>
      <Searchbar onSubmit={setQuery} />
      {status === 'idle' && <div>Free images</div>}

      {status === 'rejected' && <h1>{error.message}</h1>}

      {status === 'resolved' && (
        <>
          <ImageGallery images={images} onOpenModal={toggleModal} />
          {images.length !== 0 && (
            <Button onLoadMore={() => setPage(prevState => prevState + 1)} />
          )}
          {images.length === 0 && <div>{query} not found</div>}
        </>
      )}
      {status === 'pending' && (
        <>
          <ImageGallery images={images} onOpenModal={toggleModal} />
          <Loader type="ThreeDots" color="#3f51b5" height={80} width={80} />
        </>
      )}
      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={currImg.largeImageURL} alt={currImg.tags} />
        </Modal>
      )}
      <ToastContainer autoClose={3000} />
    </div>
  );
}
