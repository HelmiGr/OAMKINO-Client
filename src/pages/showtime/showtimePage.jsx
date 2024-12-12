import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
//import ReviewComponent from "../reviews/reviews";
//import RatingComponent from "../reviews/rating";
import apiClient from '../../api/api'; 
import PostReviews from "../reviews/postreviews";


const ShowtimePage = () => {
  const { id } = useParams();
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

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

  // Handle fetching reviews when the component mounts or when the reviews state changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiClient.get(`/movies/${id}/reviews`);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [id]);

  // If data is still loading, show a loading message
  if (loading) {
    return <div style={{ color: "white" }}>Loading show details...</div>;
  }

  // If showDetails is not found, display an error message
  if (!showDetails) {
    return <div style={{ color: "white" }}>Show details not available.</div>;
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
          color: "white",
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
      <p style={{ color: "white", marginTop: "20px", fontSize: "1.2em" }}>
        <strong>Time:</strong> {showDetails.time}
      </p>
      <p style={{ color: "white" }}>
        <strong>Theater:</strong> {showDetails.theater}
      </p>
      <p style={{ color: "white" }}>
        <strong>Duration:</strong> {showDetails.duration} minutes
      </p>
      <p style={{ color: "white" }}>
        <strong>Genres:</strong> {showDetails.genres}
      </p>
      <p style={{ color: "white" }}>
        <strong>Rating:</strong> {showDetails.rating}
      </p>
      <p style={{ color: "white" }}>
        <strong>Release Date:</strong>{" "}
        {new Date(showDetails.releaseDate).toLocaleDateString()}
      </p>
      <p style={{ color: "white" }}>
        <strong>Language:</strong> {showDetails.language}
      </p>
      <p style={{ color: "white" }}>
        <strong>Subtitles:</strong> {showDetails.subtitles || "None"}
      </p>
      <p style={{ color: "white" }}>
        <strong>Presentation:</strong> {showDetails.presentation}
      </p>

      {/* Render PostReviews Component to handle the review and rating */}
      <PostReviews
        movieId={id}
        loggedInUser={{ id: "sampleUserId", name: "Sample User" }} // Replace with actual logged-in user data
        setReviews={setReviews} // Pass the setReviews to update the review list
      />

      {/* Display the Reviews */}
      <div style={{ marginTop: "30px", width: "80%" }}>
        <h3 style={{ color: "white" }}>Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <p><strong>Rating:</strong> {review.rating}</p>
              <p>{review.review}</p>
            </div>
          ))
        ) : (
          <p style={{ color: "white" }}>No reviews yet.</p>
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