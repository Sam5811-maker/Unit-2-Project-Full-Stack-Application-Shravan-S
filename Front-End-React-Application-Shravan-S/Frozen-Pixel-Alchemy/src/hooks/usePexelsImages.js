import { useState, useEffect } from 'react';
import axios from 'axios';

const usePexelsImages = (query, perPage = 10) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
        
        if (!apiKey || apiKey === 'your_pexels_api_key_here') {
          throw new Error('Pexels API key is not configured. Please add your API key to the .env file.');
        }

        const response = await axios.get('https://api.pexels.com/v1/search', {
          headers: {
            Authorization: apiKey,
          },
          params: {
            query: query,
            per_page: perPage,
            orientation: 'square', // Good for consistent layout
          },
        });

        const imageData = response.data.photos.map(photo => ({
          id: photo.id,
          src: photo.src.medium, // Using medium size for display
          alt: photo.alt || `${query} photo`,
          photographer: photo.photographer,
          photographer_url: photo.photographer_url,
        }));

        setImages(imageData);
      } catch (err) {
        console.error('Error fetching images from Pexels:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchImages();
    }
  }, [query, perPage]);

  return { images, loading, error };
};

export default usePexelsImages;
