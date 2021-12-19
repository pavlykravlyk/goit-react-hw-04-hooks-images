import styles from './App.module.css';
import { Component } from 'react';
import { animateScroll as scroll } from 'react-scroll';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'react-loader-spinner';
import Modal from './components/Modal';
import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import Button from './components/Button';
import PixabayApiService from './services/pixabay-api';

export default class App extends Component {
  static propTypes = {};

  state = {
    searchQuery: '',
    showModal: false,
    page: 1,
    images: [],
    error: null,
    status: 'idle',
    currImg: {},
  };

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, page } = this.state;

    if (prevState.searchQuery !== searchQuery) {
      this.setState({ status: 'pending', page: 1 });

      PixabayApiService(searchQuery)
        .then(articles =>
          this.setState({
            images: articles,
            status: 'resolved',
          }),
        )
        .catch(error => this.setState({ error, status: 'rejected' }));

      scroll.scrollToBottom();
    }

    if (prevState.page !== page) {
      this.setState({ status: 'pending' });

      PixabayApiService(searchQuery, page)
        .then(articles =>
          this.setState(prevState => ({
            images: [...prevState.images, ...articles],
            status: 'resolved',
          })),
        )
        .catch(error => {
          this.setState({ error, status: 'rejected' });
          toast.error(`${searchQuery} no found`);
        });

      scroll.scrollToBottom();
    }
  }

  toggleModal = image => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
      currImg: image,
    }));
  };

  incrementPage = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  handleSearchbarFormSubmit = searchQuery => {
    this.setState({ searchQuery });
  };

  scrollToBottom = () => {
    scroll.scrollToBottom();
  };

  render() {
    const { images, error, status, currImg, searchQuery } = this.state;

    return (
      <div className={styles.App}>
        <Searchbar onSubmit={this.handleSearchbarFormSubmit} />
        {status === 'idle' && <div>Free images</div>}

        {status === 'rejected' && <h1>{error.message}</h1>}

        {status === 'resolved' && (
          <>
            <ImageGallery images={images} onOpenModal={this.toggleModal} />
            {images.length !== 0 && <Button onLoadMore={this.incrementPage} />}
            {images.length === 0 && <div>{searchQuery} no found</div>}
          </>
        )}

        {status === 'pending' && (
          <>
            <ImageGallery images={images} onOpenModal={this.toggleModal} />
            <Loader type="ThreeDots" color="#3f51b5" height={80} width={80} />
          </>
        )}

        {this.state.showModal && (
          <Modal onClose={this.toggleModal}>
            <img src={currImg.largeImageURL} alt={currImg.tags} />
          </Modal>
        )}
        <ToastContainer autoClose={3000} />
      </div>
    );
  }
}
