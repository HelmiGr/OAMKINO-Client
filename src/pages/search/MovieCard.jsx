// MovieCard.js
import React from 'react';
import '../../styles/search/MovieCard.css';

function MovieCard({ movie, onSelect }) {
  return (
    <div className="movie-card" onClick={() => onSelect(movie)}>
      <img src={movie.imageUrl} alt={movie.title} className="thumbnail" />
      <p><strong>{movie.title}</strong> ({movie.productionYear})</p>
    </div>
  );
}

export default MovieCard;
