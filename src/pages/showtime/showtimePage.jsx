import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
//import ReviewComponent from "../reviews/reviews";
//import RatingComponent from "../reviews/rating";
import apiClient from '../../api/api'; 

const ShowtimePage = () => {
  const { id } = useParams();
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await fetch(
          `https://www.finnkino.fi/xml/Schedule?showId=${id}`
        );
        const xmlText = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
        const showElements = xmlDoc.getElementsByTagName("Show");
        for (const show of showElements) {
          const showId = show.getElementsByTagName("ID")[0].textContent;
          if (showId === id) {
            setShowDetails({
              title: show.querySelector("Title")?.textContent,
              time: show.querySelector("dttmShowStart")?.textContent,
              theater: show.querySelector("Theatre")?.textContent,
              duration: show.querySelector("LengthInMinutes")?.textContent,
              picture: show.getElementsByTagName("EventSmallImagePortrait")[0]
                .textContent,
              genres: show.querySelector("Genres")?.textContent,
              rating: show.querySelector("Rating")?.textContent,
              releaseDate: show.querySelector("dtLocalRelease")?.textContent,
              language: show.querySelector("SpokenLanguage > Name")
                ?.textContent,
              subtitles: Array.from(
                show.getElementsByTagName("SubtitleLanguage1")
              )
                .map((lang) => lang.querySelector("Name")?.textContent)
                .join(", "),
              presentation: show.querySelector("PresentationMethodAndLanguage")
                ?.textContent,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching show details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [id]);

  if (loading) {
    return <div>Loading show details...</div>;
  }

  if (!showDetails) {
    return <div>Show details not available.</div>;
  }

  const handleReviewSubmit = async () => {
    if (!newReview || userRating === 0) {
      toast.error("Please provide a review and a rating!");
      return;
    }

    try {
      // Here you can send the review and rating to your API
      const response = await apiClient.post(`/showtime/${id}/reviews`, {
        review: newReview,
        rating: userRating,
      });

      // Assuming the response returns the updated reviews list
      setReviews(response.data.reviews);
      setNewReview("");
      setUserRating(0);
      toast.success("Review added successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    }
  };

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const handleReviewChange = (event) => {
    setNewReview(event.target.value);
  };

  if (loading) {
    return <div>Loading show details...</div>;
  }

  if (!showDetails) {
    return <div>Show details not available.</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "50vh",
        marginTop: "10vh",
      }}
    >
      <h1
        style={{
          fontSize: "2.5em",
          marginBottom: "20px",
        }}
      >
        {showDetails.title}
      </h1>
      <div className="showtime-image">
        <img
          style={{
            borderRadius: "10px",
          }}
          src={showDetails.picture}
          alt={`${showDetails.title} poster`}
        />
      </div>
      <p style={{ marginTop: "20px", fontSize: "1.2em" }}>
        <strong>Time:</strong> {showDetails.time}
      </p>
      <p>
        <strong>Theater:</strong> {showDetails.theater}
      </p>
      <p>
        <strong>Duration:</strong> {showDetails.duration} minutes
      </p>
      <p>
        <strong>Genres:</strong> {showDetails.genres}
      </p>
      <p>
        <strong>Rating:</strong> {showDetails.rating}
      </p>
      <p>
        <strong>Release Date:</strong>{" "}
        {new Date(showDetails.releaseDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Language:</strong> {showDetails.language}
      </p>
      <p>
        <strong>Subtitles:</strong> {showDetails.subtitles || "None"}
      </p>
      <p>
        <strong>Presentation:</strong> {showDetails.presentation}
      </p>
      
      {/* Rating and Review Section */}
      <div style={{ marginTop: "30px", width: "80%", textAlign: "center" }}>
        <h3>Submit Your Review and Rating</h3>
        <div>
          <label>
            Rating:
            <input
              type="number"
              value={userRating}
              min="1"
              max="5"
              onChange={(e) => handleRatingChange(parseInt(e.target.value))}
              style={{
                width: "50px",
                marginLeft: "10px",
                fontSize: "1.2em",
                textAlign: "center",
              }}
            />
          </label>
        </div>
        <textarea
          value={newReview}
          onChange={handleReviewChange}
          placeholder="Write your review here"
          style={{
            width: "100%",
            height: "100px",
            marginTop: "10px",
            padding: "10px",
            fontSize: "1.2em",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleReviewSubmit}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            fontSize: "1.2em",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit Review
        </button>
      </div>

      {/* Reviews List */}
      <div style={{ marginTop: "30px", width: "80%" }}>
        <h3>Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <p><strong>Rating:</strong> {review.rating}</p>
              <p>{review.review}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      <button
        style={{
          maxWidth: "40%",
          marginTop: "20px",
        }}
        onClick={() => {
          const shareUrl = `${window.location.origin}/showtime/${id}`;
          navigator.clipboard.writeText(shareUrl);
          toast.success("Link copied to clipboard!");
        }}
        className="showtime-button"
      >
        Share
      </button>
    </div>
  );
};

export default ShowtimePage;
