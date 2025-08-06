import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/photographers';

export const fetchPhotographers = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};
