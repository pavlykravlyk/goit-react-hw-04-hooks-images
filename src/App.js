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
import PixabayApiService from './services/pixabay-api';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [currImg, setCurrImg] = useState({});
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (searchQuery !== '') {
      setStatus('pending');
      setPage(1);
      setImages([]);
      getImagesFromFetch();
      scroll.scrollToBottom();
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery !== '') {
      setStatus('pending');
      getImagesFromFetch();
      scroll.scrollToBottom();
    }
  }, [page]);

  const getImagesFromFetch = async () => {
    try {
      const response = await PixabayApiService(searchQuery, page);
      if (response.ok) {
        const articles = await response.json();
        setImages(prevState => [...prevState, ...articles.hits]);
        setStatus('resolved');
      } else {
        return Promise.reject(new Error(`No matches found for ${searchQuery}`));
      }
    } catch (error) {
      setError(error);
      setStatus('rejected');
      toast.error('Input field must not be empty');
    }
  };

  const toggleModal = image => {
    setShowModal(!showModal);
    setCurrImg(image);
  };

  const incrementPage = () => {
    setPage(prevState => prevState + 1);
  };

  const handleSearchbarFormSubmit = searchQuery => {
    setSearchQuery(searchQuery);
  };

  return (
    <div className={styles.App}>
      <Searchbar onSubmit={handleSearchbarFormSubmit} />
      {status === 'idle' && <div>Free images</div>}

      {status === 'rejected' && <h1>{error.message}</h1>}

      {status === 'resolved' && (
        <>
          <ImageGallery images={images} onOpenModal={toggleModal} />
          {images.length !== 0 && <Button onLoadMore={incrementPage} />}
          {images.length === 0 && <div>{searchQuery} no found</div>}
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
