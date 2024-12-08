import React, { useState } from 'react';
import '../../styles/search/FilterSidebar.css'

function FilterSidebar({ searchTerm, onSearchChange, selectedYear, onYearChange, selectedGenre, onGenreChange, moviesData, onResetFilters }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  // Reset handler
  const handleReset = () => {
    // Call the onResetFilters function to reset all filters
    onResetFilters();
  };

  return (
    <>
      {/* Button to toggle sidebar visibility on small screens */}
      <button 
        className="filter-sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      <aside className={`filter-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2>Filter Movies</h2>

        {/* Search Bar */}
        <div className="filter-section">
          <label htmlFor="search">Search by Title</label>
          <input
            type="text"
            id="search"
            placeholder="Enter movie title"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>

        {/* Year Filter */}
        <div className="filter-section">
          <label htmlFor="year">Year</label>
          <select id="year" value={selectedYear} onChange={onYearChange}>
            <option value="">Select Year</option>
            {[...new Set(moviesData.map((movie) => movie.productionYear))].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Genre Filter */}
        <div className="filter-section">
          <label htmlFor="genre">Genre</label>
          <select id="genre" value={selectedGenre} onChange={onGenreChange}>
            <option value="">Select Genre</option>
            {[...new Set(moviesData.flatMap((movie) => movie.genres.split(", ")))].map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div className="filter-section">
          <button className="reset-button" onClick={handleReset}>
            Reset Filters
          </button>
        </div>
      </aside>
    </>
  );
}

export default FilterSidebar;
