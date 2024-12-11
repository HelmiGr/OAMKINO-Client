import React from "react";
import "../../styles/search/MovieCard.css";

const MovieCard = ({ movie, onAddToGroup, groupId, onSelectMovie }) => {
  return (
    <div className="movie-card" onClick={() => onSelectMovie(movie)}>
      <img src={movie.imageUrl} alt={movie.title} className="thumbnail" />
      <p>
        <strong className="movie-title">{movie.title}</strong> (
        {movie.productionYear})
      </p>
      {/* Show the button only if groupId is present */}
      {groupId && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering onSelectMovie
            onAddToGroup(movie.id);
          }}
        >
          Add to Group
        </button>
      )}
    </div>
  );
};

export default MovieCard;
