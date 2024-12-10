// MovieCard.js
import React from "react";
import "../../styles/search/MovieCard.css";

const MovieCard = ({ movie, onAddToGroup, groupId }) => {
  return (
    <div className="movie-card">
      <img src={movie.imageUrl} alt={movie.title} className="thumbnail" />
      <p>
        <strong className="movie-tittle">{movie.title}</strong> (
        {movie.productionYear})
      </p>
      {/* Show the button only if groupId is present */}
      {groupId && (
        <button onClick={() => onAddToGroup(movie.id)}>Add to Group</button>
      )}
    </div>
  );
};

export default MovieCard;
