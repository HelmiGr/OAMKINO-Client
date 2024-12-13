import React, { useEffect } from "react";
import apiClient from "../../api/api";
import "../../styles/reviews/review.css"
import useAuth from "../../hooks/useAuth";

const ReviewComponent = ({ movieId, reviewText, setReviewText }) => {
  const { user: loggedInUser } = useAuth(); // Access the logged-in user from AuthContext

  // Fetch user review if it already exists
  useEffect(() => {
    const fetchUserReview = async () => {
      if (!loggedInUser) return; // Ensure the user is logged in
      try {
        const response = await apiClient.get(`/movies/${movieId}/user-review`, {
          params: { userId: loggedInUser.id },
        });
        if (response.data.review) {
          setReviewText(response.data.review); // Set the user's existing review if it exists
        }
      } catch (error) {
        console.error("Error fetching user review:", error);
      }
    };

    fetchUserReview();
  }, [movieId, loggedInUser, setReviewText]);

  return (
    <div>
      <h4>Write a Review</h4>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)} // Update review text on change
        rows="4"
        cols="50"
        placeholder="Write your review here..."
      />
    </div>
  );
};

export default ReviewComponent;