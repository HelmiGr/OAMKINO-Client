import React, { useState, useEffect } from "react";
import Showtime from "./Showtime";
import ShowtimeSearch from "./ShowtimeSearch";
import ShowtimeFilter from "./ShowtimeFilter";
import "../../styles/showtimes/Showtimes.css";

// still need to find the proper url for more than one day's showtimes (found it and the link now gets the showtimes for the next 7 days)
// also changed the code to fetch showtimes from all the theatres

// styling needs to still be added to the different showtime components!

export default function Showtimes() {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredShowtimes, setFilteredShowtimes] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatres, setSelectedTheatres] = useState([]);

  const theatreIDs = [
    1012, 1039, 1038, 1002, 1045, 1031, 1032, 1033, 1013, 1015, 1016, 1017,
    1041, 1018, 1019, 1021, 1034, 1035, 1047, 1022, 1046,
  ];

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const showData = [];
        const theatreSet = new Set();
        const parser = new DOMParser();

        // fetch the showtimes from each theatre area
        for (let id of theatreIDs) {
          const response = await fetch(
            `https://www.finnkino.fi/xml/Schedule/?area=${id}&nrOfDays=7`
          );
          const text = await response.text();
          const xmlDoc = parser.parseFromString(text, "application/xml");
          const showElements = xmlDoc.getElementsByTagName("Show");

          // get the elements from each theatre area
          for (let i = 0; i < showElements.length; i++) {
            const show = showElements[i];
            const showId = show.getElementsByTagName("ID")[0].textContent;
            const title = show.getElementsByTagName("Title")[0].textContent;
            const theatre = show.getElementsByTagName("Theatre")[0].textContent;
            const startTime =
              show.getElementsByTagName("dttmShowStart")[0].textContent;
            const picture = show.getElementsByTagName(
              "EventSmallImagePortrait"
            )[0].textContent;

            showData.push({ title, theatre, startTime, picture, showId });
            theatreSet.add(theatre);
          }
        }

        setShowtimes(showData);
        setFilteredShowtimes(showData);
        setTheatres([...theatreSet]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching or parsing showtimes:", error);
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, []);

  // show only showtimes based on the search query and selected theatre(s)
  // add filtering by genre from Tobias' code?
  useEffect(() => {
    let filtered = showtimes;

    if (searchQuery) {
      filtered = filtered.filter((show) =>
        show.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTheatres.length > 0) {
      filtered = filtered.filter((show) =>
        selectedTheatres.includes(show.theatre)
      );
    }

    setFilteredShowtimes(filtered);
  }, [searchQuery, selectedTheatres, showtimes]);

  // load the data as a list in the return (using Showtime component)
  return (
    <div>
      <ShowtimeSearch
        placeholder="Search for showtimes..."
        onSearch={setSearchQuery}
      />
      <ShowtimeFilter
        theatres={theatres}
        selectedTheatres={selectedTheatres}
        onFilterChange={setSelectedTheatres}
      />
      <h1>Showtimes</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="showtimes">
          {filteredShowtimes.map((show, index) => (
            <Showtime
              key={index}
              id={show.showId}
              title={show.title}
              theatre={show.theatre}
              startTime={show.startTime}
              picture={show.picture}
            />
          ))}
        </div>
      )}
    </div>
  );
}
