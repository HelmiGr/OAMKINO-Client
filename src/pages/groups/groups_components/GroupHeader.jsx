import React from "react";
import { useNavigate } from "react-router-dom";

const GroupHeader = ({ group, isAdmin, onDeleteGroup }) => {
  const navigate = useNavigate(); // Ensure useNavigate is always called

  console.log("Group prop:", group); // Log the entire group object

  if (!group) return <div>Loading group details...</div>;
  console.log("Group ID being passed to forum:", group.id);

  const goToForum = () => {
    if (!group?.id) {
      console.error("Group ID is missing in navigation logic");
      return;
    }
    navigate(`/forum/${group.id}`);
  };

  return (
    <header>
      <h2>Group {group.group_name}</h2>
      <button onClick={goToForum}>Go to Forum</button>

      {isAdmin && (
        <button className="btn danger" onClick={onDeleteGroup}>
          Delete Group
        </button>
      )}
    </header>
  );
};

export default GroupHeader;
