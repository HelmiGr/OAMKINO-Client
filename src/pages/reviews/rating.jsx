import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../api/api";

const RatingComponent = ({ movieId, loggedInUser, rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0); // Track hover state

  useEffect(() => {
    // If a user is logged in and they already have a rating for this movie, load it
    if (loggedInUser && movieId) {
      const fetchUserRating = async () => {
        try {
          const response = await apiClient.get(`/movies/${movieId}/user-rating`, {
            params: { userId: loggedInUser.id },
          });
          if (response.data.rating) {
            setRating(response.data.rating); // Set the user rating if it exists
          }
        } catch (error) {
          console.error("Error fetching user rating:", error);
        }
      };
      fetchUserRating();
    }
  }, [movieId, loggedInUser, setRating]);

  const handleStarClick = async (newRating) => {
    setRating(newRating); // Update the rating in state

    try {
      // Post the new rating to the backend when the user clicks a star
      await apiClient.post(`/movies/${movieId}/rating`, {
        rating: newRating,
        userId: loggedInUser.id,
      });
    } catch (error) {
      console.error("Error posting rating:", error);
    }
  };

  return (
<div>
  <h4>Rate this Movie</h4>
  <div
    style={{
      display: "flex",
      gap: "5px",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {[1, 2, 3, 4, 5].map((star) => (
      <div
        key={star}
        onClick={() => handleStarClick(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
        style={{
          fontSize: "2rem",
          cursor: "pointer",
          color: star <= (hoverRating || rating) ? "#DAA520" : "#ccc",
          transition: "color 0.2s",
        }}
      >
        <FontAwesomeIcon icon={solidStar} />
      </div>
    ))}
  </div>
</div>
  );
};

export default RatingComponent;