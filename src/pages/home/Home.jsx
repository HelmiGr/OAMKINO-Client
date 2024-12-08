import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/home/Home.css";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showtimes, setShowtimes] = useState([]);
  const [uniqueMovies, setUniqueMovies] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch showtimes from API
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const theaterIDs = [
          1012, 1039, 1038, 1002, 1045, 1031, 1032, 1033, 1013, 1015, 1016,
          1017, 1041, 1018, 1019, 1021, 1034, 1035, 1047, 1022, 1046,
        ]; // Add all theater IDs here

        const showtimeList = [];
        const parser = new DOMParser();

        // Fetch showtimes from each theater
        for (const id of theaterIDs) {
          const response = await fetch(
            `https://www.finnkino.fi/xml/Schedule/?area=${id}&nrOfDays=7`
          );
          const xmlText = await response.text();
          const xmlDoc = parser.parseFromString(xmlText, "application/xml");
          const showElements = xmlDoc.getElementsByTagName("Show");

          // Combine data from each theater
          Array.from(showElements).forEach((show) => {
            showtimeList.push({
              id: show.getElementsByTagName("ID")[0]?.textContent,
              title: show.querySelector("Title")?.textContent,
              time: show.querySelector("dttmShowStart")?.textContent,
              theater: show.querySelector("Theatre")?.textContent,
              picture:
                show.querySelector("EventSmallImagePortrait")?.textContent ||
                "",
            });
          });
        }

        // Deduplicate movies by title
        const uniqueMoviesMap = new Map();
        showtimeList.forEach((show) => {
          if (!uniqueMoviesMap.has(show.title)) {
            uniqueMoviesMap.set(show.title, show);
          }
        });

        setShowtimes(showtimeList);
        setUniqueMovies(Array.from(uniqueMoviesMap.values())); // Extract unique movies
        setLoading(false);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, []);

  // Auto-slide for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000); // Change slide every 10 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <>
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

      {/* Showtimes Section */}
      <section id="show-times-section">
        <div className="container">
          <h1 className="show-times-title">
            <strong>Show Times</strong>
          </h1>
          {loading ? (
            <div>Loading showtimes...</div>
          ) : (
            <div id="show-time-list">
              {uniqueMovies.slice(0, 6).map((movie) => (
                <div key={movie.id}>
                  <div className="card">
                    <img
                      src={movie.picture}
                      className="card-img-top"
                      alt={`${movie.title} Poster`}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{movie.title}</h5>

                      <Link
                        to={{
                          pathname: `/showtimes_home/${movie.title}`,
                        }}
                        state={{
                          movieTitle: movie.title,
                          showtimes: showtimes,
                        }}
                        className="btn btn-primary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <Link to="/showtimes" className="show-all-button">
            SHOW ALL »
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
