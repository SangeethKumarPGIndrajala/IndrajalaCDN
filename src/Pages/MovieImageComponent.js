import React from 'react';
import { useParams } from 'react-router-dom';

const MovieImageComponent = () => {
  const { imageId } = useParams();

  return (
    <img
      src={`https://cdn.indrajala.in/movieImages/${imageId}`}
      alt="Movie"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default MovieImageComponent;