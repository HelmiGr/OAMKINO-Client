import React, { useState, useEffect } from "react";
import apiClient from "../../api/api";
import ReviewComponent from "./reviews";
import RatingComponent from "./rating";
import "../../styles/reviews/review.css"
import useAuth from "../../hooks/useAuth";

const PostReviews = ({ movieId }) => {
    const { user: loggedInUser } = useAuth(); // Access the logged-in user
    const [reviewText, setReviewText] = useState(""); // State for review text
    const [rating, setRating] = useState(0); // State for rating
    const [alertMessage, setAlertMessage] = useState(""); // State for alert message
    const [reviews, setReviews] = useState([]); // State for all reviews
    const [averageRating, setAverageRating] = useState(0); // State for average rating
  
    // Fetch reviews and ratings when the component loads
    useEffect(() => {
      const fetchReviewsAndRatings = async () => {
        try {
          // Fetch all reviews
          const reviewsResponse = await apiClient.get(`/movies/${movieId}/reviews`);
          setReviews(reviewsResponse.data);
  
          // Fetch average rating
          const ratingResponse = await apiClient.get(`/movies/${movieId}/ratings`);
          setAverageRating(ratingResponse.data.average || 0);
        } catch (error) {
          console.error("Error fetching reviews and ratings:", error);
        }
      };
  
      fetchReviewsAndRatings();
    }, [movieId]);
  
    const handlePostReview = async () => {
      if (!loggedInUser) {
        setAlertMessage("You must be logged in to post a review!");
        return;
      }
  
      try {
        if (!reviewText.trim()) {
          setAlertMessage("Please write a review!");
          return;
        }
  
        // Post the review to the backend
        await apiClient.post(`/movies/${movieId}/reviews`, {
          userId: loggedInUser.id,
          review: reviewText,
        });
  
        // Post the rating to the backend
        await apiClient.post(`/movies/${movieId}/rating`, {
          rating: rating,
          userId: loggedInUser.id,
        });
  
        // Reset the form fields after posting
        setReviewText("");
        setRating(0);
        setAlertMessage(""); // Reset alert message
  
        // Re-fetch reviews and ratings after posting
        const reviewsResponse = await apiClient.get(`/movies/${movieId}/reviews`);
        setReviews(reviewsResponse.data);
  
        const ratingResponse = await apiClient.get(`/movies/${movieId}/ratings`);
        setAverageRating(ratingResponse.data.average || 0);
      } catch (error) {
        console.error("Error posting both review and rating:", error);
      }
    };
  
    return (
      <div className="post-reviews-container">
        <h2>Post Your Review and Rating</h2>
  
        {/* Show alert message if review is empty */}
        {alertMessage && <p className="alert-message">{alertMessage}</p>}
  
        {/* Render the ReviewComponent for text review submission */}
        <ReviewComponent
          movieId={movieId}
          reviewText={reviewText}
          setReviewText={setReviewText}
        />
  
        {/* Render the RatingComponent for star rating submission */}
        <RatingComponent
          movieId={movieId}
          rating={rating}
          setRating={setRating}
        />
  
        {/* Single button to post both review and rating */}
        {loggedInUser && (
          <button className="button-style" onClick={handlePostReview}>
            Post Your Review
          </button>
        )}
        {!loggedInUser && (
          <p className="login-warning">Please log in to post a review.</p>
        )}
  
  
        <div className="rating-section">
          <h3>Average Rating</h3>
          <p>{averageRating.toFixed(1)} / 5</p>
        </div>
      </div>
    );
  };
  
  export default PostReviews;