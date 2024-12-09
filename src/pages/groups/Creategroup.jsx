import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/api";

const Creategroup = () => {
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!groupName) {
      alert("Group name is required!");
      return;
    }

    try {
      const response = await apiClient.post("/groups", {
        group_name: groupName.trim(),
      });

      alert("Group created successfully!");

      navigate("/groups");
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.error || "Failed to create group");
      } else {
        console.error("Error creating group:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <h2>Create a New Group</h2>
      <input
        type="text"
        placeholder="Enter group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
};

export default Creategroup;
