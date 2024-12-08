import React from "react";
import "../../styles/showtimes/Showtime.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Showtime({ title, theatre, startTime, picture, id }) {
  // return a template for each individual showtime that can be used
  // this will be imported in the showtimes file which fetches the data
  return (
    <Link
      style={{
        textDecoration: "none",
        color: "black",
      }}
      to={`/showtime/${id}`}
      className="showtime-card"
    >
      <div className="showtime-image">
        <img src={picture} alt={`${title} poster`} />
      </div>
      <div className="showtime-info">
        <div className="showtime-title">{title}</div>
        <div className="showtime-details">{theatre}</div>
        <div className="showtime-details">
          {new Date(startTime).toLocaleString()}
        </div>
        <div className="showtime-button-container">
          <button
            onClick={(event) => {
              event.stopPropagation(); // Prevent Link navigation
              event.preventDefault(); // Optional: Prevent default button behavior
              const shareUrl = `${window.location.origin}/showtime/${id}`;
              navigator.clipboard.writeText(shareUrl);
              toast.success("Link copied to clipboard!");
            }}
            className="showtime-button"
          >
            Share
          </button>
        </div>
      </div>
    </Link>
  );
}
