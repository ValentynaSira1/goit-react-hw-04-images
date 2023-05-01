import { useEffect, useState } from 'react';
import { fetchImages } from '../servis/pixabay_Api';
import { Searchbar } from './searchBar/SearchBar';
import { ImageGallery } from './imageGallery/ImageGallery';
import { Btn } from './btn/Btn';
import { Loader } from './loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
import { Modal } from './modal/Modal';
import 'react-toastify/dist/ReactToastify.css';
import css from './App.module.css';

export const App = () => {
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageInfo, setImageInfo] = useState({ modalImage: '', tags: '' });

  useEffect(() => {
    
    if (search === '' && page === 1) {
      return;
    }
    getImages(search, page);
  }, [search, page]);

const onSubmit = searchImages => {
    setSearch (searchImages);
    setPage (1);
    setImages ([]);
  };

const getImages = async (search, page) => {
    setIsLoading(true);
    try {
      const { Arr, total } = await fetchImages(search, page);
      if (Arr.length === 0) {
        return toast.error(`No images on search ${search}`);
      }

      setImages(prevImages => [...prevImages, ...Arr]);
      setTotal  (total);
      
    } catch (error) {
      setError(error);
    }finally {
      setIsLoading(false);
    }
  };

const onLoadMoreClick = () => {
    setPage (prevPage => prevPage + 1);
  };

const onOpenModal = (modalImage, tags) => {
  setShowModal(true);
  setImageInfo ({ modalImage, tags });
  };

const onCloseModal = () => {
  setShowModal(false);
  setImageInfo ({ modalImage: '', tags: '' });
  };

  const totalPage = total / images.length;

    return (
      <section className={css.App}>
        <Searchbar onSubmit={onSubmit} />
        {images.length > 0 && (
          <ImageGallery images={images} onOpenModal={onOpenModal} />
        )}
        {isLoading && <Loader />}
        {totalPage > 1 && !isLoading && images.length > 0 && (
          <Btn loadMore={onLoadMoreClick} />
        )}
        {error && <h2>An error occurred on the server</h2>}
        {showModal && (
          <Modal
            onCloseModal={onCloseModal}
            modalImage={imageInfo.modalImage}
            tags={imageInfo.tags}
          />
        )}
        <ToastContainer position="top-center" autoClose={2000} theme="light" />
      </section>
    );
}