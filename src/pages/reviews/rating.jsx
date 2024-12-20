import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../api/api";
import useAuth from "../../hooks/useAuth";

const RatingComponent = ({ movieId, rating, setRating }) => {
  const { user: loggedInUser } = useAuth(); // Get the logged-in user
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (loggedInUser && movieId) {
      const fetchUserRating = async () => {
        try {
          const response = await apiClient.get(`/movies/${movieId}/user-rating`, {
            params: { userId: loggedInUser.id },
          });
          if (response.data.rating) {
            setRating(response.data.rating);
          }
        } catch (error) {
          console.error("Error fetching user rating:", error);
        }
      };
      fetchUserRating();
    }
  }, [movieId, loggedInUser, setRating]);

  const handleStarClick = async (newRating) => {
    if (!loggedInUser) {
      console.error("User is not logged in");
      return;
    }

    setRating(newRating);

    try {
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
      <div style={{ display: "flex", gap: "5px", justifyContent: "center", alignItems: "center" }}>
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