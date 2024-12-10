import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/api";
import "../../../styles/search/MovieSearchXml.css";
import "../../../styles/groups/GroupMovies.css";

const GroupMovies = ({ groupId }) => {
  const [groupMovies, setGroupMovies] = useState([]); // State to hold group movies
  const [selectedMovie, setSelectedMovie] = useState(null); // State for selected movie details
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupMovies = async () => {
      try {
        // Fetch movies associated with the group
        const response = await apiClient.get(`/Customgroup/${groupId}/movies`);

        const movieIds = response.data.map((movie) => movie.movie_id);

        // Fetch all movies from Finnkino API
        const finnkinoResponse = await fetch(
          "https://www.finnkino.fi/xml/Events/"
        );
        const data = await finnkinoResponse.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");
        const events = Array.from(xml.getElementsByTagName("Event")).map(
          (event) => ({
            id: event.querySelector("ID")?.textContent,
            title: event.querySelector("Title")?.textContent,
            productionYear: event.querySelector("ProductionYear")?.textContent,
            genres: event.querySelector("Genres")?.textContent,
            imageUrl: event.querySelector("Images > EventMediumImagePortrait")
              ?.textContent,
            synopsis: event.querySelector("Synopsis")?.textContent,
          })
        );

        // Filter only the movies in this group
        const filteredMovies = events.filter((movie) =>
          movieIds.includes(movie.id)
        );

        // Add `added_by_user` data from backend to filtered movies
        const enrichedMovies = filteredMovies.map((movie) => {
          const movieData = response.data.find(
            (backendMovie) => backendMovie.movie_id === movie.id
          );
          return {
            ...movie,
            added_by_user: movieData?.added_by_user || "Unknown",
          };
        });
        setGroupMovies(enrichedMovies); // Update state with enriched movies
      } catch (error) {
        console.error("Error fetching group movies:", error);
      }
    };

    fetchGroupMovies();
  }, [groupId]);

  useEffect(() => {
    console.log("Updated groupMovies state:", groupMovies);
  }, [groupMovies]);

  return (
    <div className="group-movies-container">
      <h2 className="grouptitle">Movies in Group </h2>
      {selectedMovie ? (
        <div className="movie-details">
          <button onClick={() => setSelectedMovie(null)}>Back to List</button>
          <h2>
            {selectedMovie.title} ({selectedMovie.productionYear})
          </h2>
          <img src={selectedMovie.imageUrl} alt={selectedMovie.title} />
          <p>{selectedMovie.synopsis}</p>
          {/* <h4>Genres:</h4>
          <p>{selectedMovie.genres}</p> */}
        </div>
      ) : (
        <div className="movie-card-container">
          {groupMovies.length > 0 ? (
            groupMovies.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => setSelectedMovie(movie)}
              >
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                  className="movie-image"
                />
                <h3>{movie.title}</h3>
                <p>Year: {movie.productionYear}</p>
                {/* <p>Genres: {movie.genres}</p> */}
                <p>
                  <strong className="member-added">Added by:</strong>{" "}
                  {movie.added_by_user || "Unknown"}
                </p>
              </div>
            ))
          ) : (
            <p>No movies have been added to this group yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupMovies;
