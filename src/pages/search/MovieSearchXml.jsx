import React, { useState, useEffect } from "react";
import "../../styles/search/MovieSearchXml.css";
import FilterSidebar from "./FilterSidebar";
import MovieCard from "./MovieCard";
import { useLocation } from "react-router-dom"; //add for footer link

function MovieSearchXml() {
  const location = useLocation(); //add for footer link
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [moviesData, setMoviesData] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Extract genre from URL query parameters for footer link
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genre = params.get("genre");
    if (genre) {
      setSelectedGenre(genre);
    }
  }, [location]);

  useEffect(() => {
    fetch("https://www.finnkino.fi/xml/Events/")
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");
        const events = Array.from(xml.getElementsByTagName("Event"));
        const movies = events.map((event) => ({
          id: event.querySelector("ID")?.textContent,
          title: event.querySelector("Title")?.textContent,
          productionYear: event.querySelector("ProductionYear")?.textContent,
          genres: event.querySelector("Genres")?.textContent,
          imageUrl: event.querySelector("Images > EventMediumImagePortrait")
            ?.textContent,
          synopsis: event.querySelector("Synopsis")?.textContent,
          cast: Array.from(event.querySelectorAll("Cast Actor")).map(
            (actor) => ({
              firstName: actor.querySelector("FirstName")?.textContent,
              lastName: actor.querySelector("LastName")?.textContent,
            })
          ),
        }));
        setMoviesData(movies);
      })
      .catch((error) =>
        console.error("Error fetching or parsing XML data:", error)
      );
  }, []);

  const handleResetFilters = () => {
    // Reset all filter states to default values
    setSearchTerm("");
    setSelectedYear("");
    setSelectedGenre("");
  };

  const filteredMovies = moviesData.filter((movie) => {
    return (
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedYear || movie.productionYear === selectedYear) &&
      (!selectedGenre ||
        movie.genres.toLowerCase().includes(selectedGenre.toLowerCase()))
    );
  });

  return (
    <div>
      <h2 className="main-title">
        From classics to the latest hits, find movies you'll love
      </h2>

      <div className="movie-search-container">
        <FilterSidebar
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          selectedYear={selectedYear}
          onYearChange={(e) => setSelectedYear(e.target.value)}
          selectedGenre={selectedGenre}
          onGenreChange={(e) => setSelectedGenre(e.target.value)}
          moviesData={moviesData}
          onResetFilters={handleResetFilters} // Pass down the reset handler
        />

        <section className="search-results">
          {selectedMovie ? (
            <div className="movie-details">
              <button onClick={() => setSelectedMovie(null)}>
                Back to List
              </button>
              <h2>
                {selectedMovie.title} ({selectedMovie.productionYear})
              </h2>
              <img src={selectedMovie.imageUrl} alt={selectedMovie.title} />
              <p>{selectedMovie.synopsis}</p>
              <h4>Cast:</h4>
              <ul>
                {selectedMovie.cast.map((actor, index) => (
                  <li key={index}>
                    {actor.firstName} {actor.lastName}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="movie-card-container">
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onSelect={setSelectedMovie}
                  />
                ))
              ) : (
                <div className="no-results">
                  <p>No movies found matching your criteria.</p>
                  <button onClick={handleResetFilters}>Back to List</button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default MovieSearchXml;
