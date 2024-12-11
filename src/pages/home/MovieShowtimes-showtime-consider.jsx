// import React from "react";
// import { useLocation } from "react-router-dom";
// import Showtime from "../showtimes/Showtime";

// const MovieShowtimes = () => {
//   const location = useLocation();
//   const { state } = location || {}; // Extract state passed from Link
//   const { movieTitle = "", showtimes = [] } = state || {}; // Destructure movieTitle and showtimes

//   // Filter showtimes for the specific movie title
//   const filteredShowtimes = showtimes.filter(
//     (show) => show.title.toLowerCase() === movieTitle.toLowerCase()
//   );

//   if (filteredShowtimes.length === 0) {
//     return <div>No showtimes available for "{movieTitle}".</div>;
//   }

//   return (
//     <div>
//       <h1>Showtimes for "{movieTitle}"</h1>
//       <div className="showtimes-container">
//         {filteredShowtimes.map((show) => (
//           <Showtime
//             key={show.id}
//             id={show.id}
//             title={show.title}
//             theatre={show.theater}
//             startTime={show.time}
//             picture={show.picture}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MovieShowtimes;
