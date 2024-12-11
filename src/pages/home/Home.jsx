import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/home/Home.css";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [moviesData, setMoviesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null); // For movie details view

  useEffect(() => {
    document.body.classList.add("home-page"); // Add class when Home is rendered
    return () => {
      document.body.classList.remove("home-page"); // Remove class when leaving Home
    };
  }, []);

  // Carousel slides data
  const slides = [
    {
      id: 0,
      title: "Explore the Latest Movies",
      description: "Discover and Dive into the World of Movies",
      linkText: "Search",
      linkTo: "/search",
      image:
        "https://img.freepik.com/free-photo/view-3d-cinema-theatre-room_23-2150866053.jpg",
    },
    {
      id: 1,
      title: "Explore the Latest Movies",
      description: "Discover and Dive into the World of Movies",
      linkText: "Favourites",
      linkTo: "/favourites",
      image:
        "https://kubrick.htvapps.com/htv-prod-media.s3.amazonaws.com/images/gettyimages-1243093587-65961955d7442.jpg?crop=1.00xw:0.847xh;0,0.153xh&resize=1200:*",
    },
  ];

  // Fetch movies from Finnkino XML API
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Auto-slide for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000); // Change slide every 10 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div>
      {/* Carousel Section */}
      <section className="carousel">
        <div className="carousel-container">
          <div
            className="carousel-slide"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="carousel-item"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="carousel-caption">
                  <h1>{slide.title}</h1>
                  <p>{slide.description}</p>
                  <p>
                    <Link
                      className="carousel-btn btn-primary"
                      to={slide.linkTo}
                    >
                      {slide.linkText}
                    </Link>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-control prev"
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev - 1 + slides.length) % slides.length
              )
            }
          >
            &#10094;
          </button>
          <button
            className="carousel-control next"
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % slides.length)
            }
          >
            &#10095;
          </button>
        </div>
      </section>

      {/* Movies Section */}
      <section id="movies-section">
        <div className="container">
          <h1 className="movies-title">
            <strong>Movies</strong>
          </h1>
          {loading ? (
            <div style={{ color: 'white' }}>Loading movies...</div>
          ) : selectedMovie ? (
            // Movie Details View
            <div className="movie-details">
              <button onClick={() => setSelectedMovie(null)}>
                Back to List
              </button>
              <h2>
                {selectedMovie.title} ({selectedMovie.productionYear})
              </h2>
              <img
                src={selectedMovie.imageUrl}
                alt={selectedMovie.title}
                className="movie-image"
              />
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
            <div id="movies-list">
              {moviesData.slice(0, 6).map((movie) => (
                <div key={movie.id}>
                  <div className="card">
                    <img
                      src={movie.imageUrl}
                      className="card-img-top"
                      alt={`${movie.title} Poster`}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{movie.title}</h5>
                      <button
                        className="btn btn-primary"
                        onClick={() => setSelectedMovie(movie)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <Link to="/search" className="show-all-button">
            SHOW ALL »
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
