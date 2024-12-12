import React, { useState } from "react";
import "../../styles/forum/GroupPostingBox.css";
import TagInput from "./Tagnameinput";

export default function GroupPostingBox({ onSubmitPost }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // To manage submission state

  const handlePostSubmit = async () => {
    if (isSubmitting || !currentMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitPost(currentMessage.trim());
      setCurrentMessage("");
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <p className="posting-box-text">Add a post</p>
      <TagInput onMessageChange={setCurrentMessage} />
      <div className="post-container">
        <button
          className="submit-post"
          onClick={handlePostSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post"} {/* Show a loading state */}
        </button>
      </div>
    </div>
  );
}
