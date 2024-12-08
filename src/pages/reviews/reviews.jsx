import React, { useState, useEffect } from "react";
import apiClient from "../../api/api"; // Assuming apiClient is in utils

const ReviewComponent = ({ movieId, loggedInUser }) => {
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    // Fetch existing reviews when the component mounts
    const fetchReviews = async () => {
      try {
        const response = await apiClient.get(`/movies/${movieId}/reviews`);
        setReviews(response.data.reviews);

        // Check if the logged-in user has already written a review
        const userReviewResponse = await apiClient.get(`/movies/${movieId}/user-review`, {
          params: { userId: loggedInUser.id },
        });
        setUserReview(userReviewResponse.data.review);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [movieId, loggedInUser]);

  const handlePostReview = async () => {
    try {
      const response = await apiClient.post(`/movies/${movieId}/reviews`, {
        userId: loggedInUser.id,
        review: reviewText,
      });

      // Update the reviews state with the new review
      setReviews([...reviews, response.data.review]);
      setReviewText(""); // Clear the review input
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await apiClient.delete(`/movies/${movieId}/reviews/${userReview.id}`);
      // Remove the deleted review from the state
      setReviews(reviews.filter((review) => review.id !== userReview.id));
      setUserReview(null);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleEditReview = async () => {
    try {
      const updatedReview = await apiClient.put(`/movies/${movieId}/reviews/${userReview.id}`, {
        review: reviewText,
      });

      // Update the review in the state
      setReviews(reviews.map((review) =>
        review.id === updatedReview.data.id ? updatedReview.data : review
      ));
      setUserReview(updatedReview.data);
      setReviewText(""); // Clear the review input
    } catch (error) {
      console.error("Error editing review:", error);
    }
  };

  return (
    <div>
      <h3>Reviews</h3>

      {loggedInUser && !userReview && (
        <div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write a review..."
          />
          <button onClick={handlePostReview}>Post Review</button>
        </div>
      )}

      {userReview && (
        <div>
          <h4>Your Review</h4>
          <p>{userReview.text}</p>
          <textarea
            value={reviewText || userReview.text}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <button onClick={handleEditReview}>Edit Review</button>
          <button onClick={handleDeleteReview}>Delete Review</button>
        </div>
      )}

      <div>
        <h4>All Reviews</h4>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id}>
              <p>{review.text}</p>
              <small>By {review.user.name}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewComponent;