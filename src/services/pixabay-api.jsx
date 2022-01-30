import PropTypes from 'prop-types';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '23902495-d255dd7217da8bb07f7abae59';

const fetchImages = async (query, page) => {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    orientation: 'horizontal',
    image_type: 'photo',
    q: query,
    page: page,
    per_page: 12,
  });

  try {
    const { data } = await axios.get(`${BASE_URL}?${searchParams}`);
    return data.hits;
  } catch (error) {
    return error;
  }
};

fetchImages.propTypes = {
  query: PropTypes.string,
  page: PropTypes.number,
};

export default fetchImages;
