import React from "react";

const GroupPage = ({ group, user, onBack, onDelete }) => {
  const isOwner = group.owner_id === user.user_id; // Verify ownership based on user_id

  return (
    <div>
      <h2>{group.group_name}</h2> {/* Display group_name */}
      <p>Group ID: {group.group_id}</p> {/* Display group_id */}
      <p>Owner: {group.owner_name ? group.owner_name : "Unknown"}</p> {/* Display owner_name or "Unknown" if not provided */}
      <button onClick={onBack} style={{ marginRight: "10px" }}>
        Back
      </button>
      {isOwner && (
        <button
          onClick={() => onDelete(group.group_id)} // Delete action for the owner
          style={{
            color: "white",
            backgroundColor: "red",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Delete Group
        </button>
      )}
    </div>
  );
};

export default GroupPage;
