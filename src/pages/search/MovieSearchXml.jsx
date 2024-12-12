import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/search/MovieSearchXml.css";
import FilterSidebar from "./FilterSidebar";
import MovieCard from "./MovieCard";
import apiClient from "../../api/api";
import AddToGroupMovies from "../groups/custom_components/AddToGroupMovies"; // Import modal
import FavouriteButton from "../../components/favourite/addFavourite";
import PostReviews from "../reviews/postreviews";

function MovieSearchXml() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const groupId = params.get("groupId");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [moviesData, setMoviesData] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [groups, setGroups] = useState([]); // Groups data for the modal

  // Extract genre from URL query parameters
  useEffect(() => {
    const genre = params.get("genre");
    if (genre) {
      setSelectedGenre(genre);
    }
  }, [params]);

  // Fetch movie data from the Finnkino XML API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("https://www.finnkino.fi/xml/Events/");
        const data = await response.text();
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
      } catch (error) {
        console.error("Error fetching or parsing XML data:", error);
      }
    };

    fetchMovies();
  }, []);

  // Fetch available groups for the modal
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await apiClient.get("/groups/all");
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleAddToGroup = async (movieId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Authentication token is missing. Please log in.");
      return;
    }

    try {
      const response = await apiClient.post(
        `/Customgroup/${groupId}/movies`,
        { movieId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Movie added successfully!");
      navigate(`/groupPage/${groupId}`);
    } catch (error) {
      console.error(
        "Error adding movie to group:",
        error.response || error.message
      );
      alert(error.response?.data?.error || "Failed to add movie to group.");
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedYear("");
    setSelectedGenre("");
  };

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
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
          onResetFilters={handleResetFilters}
        />

        <section className="search-results">
          {selectedMovie ? (
            <div className="movie-details">
              <button onClick={() => setSelectedMovie(null)}>
                Back to List
              </button>
              <FavouriteButton movieId={selectedMovie.id} />

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
                    groupId={groupId}
                    onAddToGroup={(movieId) => handleAddToGroup(movieId)}
                    onSelectMovie={handleSelectMovie}
                  />
                ))
              ) : (
                <div className="no-results">
                  <p style={{ color: 'white' }}>No movies found matching your criteria.</p>
                  <button onClick={handleResetFilters}>Back to List</button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* PostReviews component for review and rating */}
      {selectedMovie && (
        <PostReviews movieId={selectedMovie.id}  />
      )}

      {/* AddToGroupModal */}
      <AddToGroupMovies onSubmit={handleAddToGroup} groups={groups} />
    </div>
  );
}

export default MovieSearchXml;