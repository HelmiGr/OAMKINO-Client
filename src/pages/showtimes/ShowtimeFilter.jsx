import React from 'react';
import '../../styles/showtimes/ShowtimeFilter.css'; 

// styling from Ruwani once she's done

export default function ShowtimeFilter({ theatres, selectedTheatres, onFilterChange }) {
  const handleTheatreToggle = (theatre) => {
    if (selectedTheatres.includes(theatre)) {
      onFilterChange(selectedTheatres.filter((t) => t !== theatre));
    } else {
      onFilterChange([...selectedTheatres, theatre]);
    }
  };

  return (
    <div className="filter-box">
      <h2 className="filter-subtitle">Theatres</h2>
      <div className="theatre-list">
        {theatres.map((theatre, index) => (
          <button
            key={index}
            className={`theatre-button ${selectedTheatres.includes(theatre) ? 'selected' : ''}`}
            onClick={() => handleTheatreToggle(theatre)}
          >
            {theatre}
          </button>
        ))}
      </div>
    </div>
  );
}

