import React, { useState, useEffect } from "react";
import ReviewComponent from "./reviews";
import RatingComponent from "./rating";
import apiClient from "../../api/api";
import "../../styles/reviews/review.css"

const PostReviews = ({ movieId, loggedInUser }) => {
    const [reviewText, setReviewText] = useState(""); // State for review text
    const [rating, setRating] = useState(0); // State for rating
    const [alertMessage, setAlertMessage] = useState(""); // State for alert message
  
    const handlePostReview = async () => {
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
          loggedInUser={loggedInUser}
          reviewText={reviewText}
          setReviewText={setReviewText}
        />
  
        {/* Render the RatingComponent for star rating submission */}
        <RatingComponent
          movieId={movieId}
          loggedInUser={loggedInUser}
          rating={rating}
          setRating={setRating}
        />
  
        {/* Single button to post both review and rating */}
        {loggedInUser && (
          <button className="button-style" onClick={handlePostReview}>
            Post Your Review
          </button>
        )}
      </div>
    );
  };
  
  export default PostReviews;