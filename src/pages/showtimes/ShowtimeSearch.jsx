import React, { useState } from 'react';

// styling needs to be added from Ruwani once she's ready

export default function ShowtimeSearch({ placeholder = 'Search...', onSearch }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && onSearch) {
        onSearch(query);
    }
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
}
