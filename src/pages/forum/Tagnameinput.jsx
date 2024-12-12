import React, { useState } from "react";
import apiClient from "../../api/api";

const TagInput = ({ onMessageChange }) => {
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = async (e) => {
    const input = e.target.value;
    setMessage(input);
    onMessageChange(input); // Notify parent component of the updated message

    const lastWord = input.split(" ").pop();
    if (lastWord.startsWith("@")) {
      const searchTerm = lastWord.slice(1);
      if (searchTerm) {
        try {
          const response = await apiClient.get(
            `/forum/search?search=${searchTerm}`
          );
          setSuggestions(response.data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (user_name) => {
    const lastWord = message.split(" ").pop();
    const newMessage = message.replace(
      new RegExp(`${lastWord}$`),
      `@${user_name} `
    );
    setMessage(newMessage);
    onMessageChange(newMessage);
    setShowSuggestions(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <textarea
        value={message}
        onChange={handleInputChange}
        placeholder="Type a message... Tag members with @username"
        style={{ width: "100%", height: "100px", padding: "10px" }}
      ></textarea>
      {showSuggestions && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            border: "1px solid #ccc",
            background: "#fff",
            zIndex: 1000,
          }}
        >
          {suggestions.map((user) => (
            <div
              key={user.user_name}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onClick={() => handleSuggestionClick(user.user_name)}
            >
              {user.user_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
