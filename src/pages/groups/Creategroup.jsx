import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import apiClient from "../../api/api";
import { toast } from "react-hot-toast";

const Creategroup = () => {
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken"); // Fetch token from localStorage

  // Redirect to login if not authenticated
  if (!token) {
    toast("You need to log in to access this page.");
    return <Navigate to="/login" replace />;
  }

  const handleCreate = async () => {
    if (!groupName.trim()) {
      toast.error("Group name is required!");
      return;
    }

    try {
      const response = await apiClient.post(
        "/groups",
        { group_name: groupName.trim() },
        { headers: { Authorization: `Bearer ${token}` } } // Include token in the header
      );

      toast.success("Group created successfully!");
      navigate("/groups"); // Navigate to groups page after creation
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || "Failed to create group");
      } else {
        console.error("Error creating group:", error);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <h2 style={{ color: "white" }}>Create a New Group</h2>
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
