import React from "react";
import "../../styles/search/MovieCard.css";

const MovieCard = ({ movie, onAddToGroup, groupId, onSelectMovie }) => {
  return (
    <div className="movie-card" onClick={() => onSelectMovie(movie)}>
      <img src={movie.imageUrl} alt={movie.title} className="thumbnail" />
      <div className="movie-content">
        <p>
          <strong className="movie-title">{movie.title}</strong> (
          {movie.productionYear})
        </p>
        {groupId && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering onSelectMovie
              onAddToGroup(movie.id);
            }}
            aria-label={`Add ${movie.title} to group`}
          >
            Add to Group
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
