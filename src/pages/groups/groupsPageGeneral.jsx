import React, { useState, useEffect } from "react";
import "../../styles/groups/groupsPageGeneral.css";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/api";

const GroupsPageGeneral = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await apiClient.get("groups/all");
        console.log(response.data);
        setGroups(response.data);
      } catch (err) {
        console.error("Failed to fetch groups:", err);
        alert("Failed to fetch groups. Please try again later.");
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="groups-page-general">
      {/* Navbar */}
      <nav className="navbar">
        <h1>Groups</h1>
        <div className="navbar-buttons">
          <button
            className="btn create-group"
            onClick={() => navigate("/createGroup")}
          >
            Create Group
          </button>
          <button
            className="btn your-groups"
            onClick={() => navigate("/yourGroup")}
          >
            Your Groups
          </button>
        </div>
      </nav>

      <table className="groups-table">
        <thead>
          <tr>
            <th>Group Name</th>
            <th>Owner Email</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {groups.length > 0 ? (
            groups.map((group) => (
              <tr
                key={group.group_id}
                onClick={() => navigate(`/groupPage/${group.group_id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{group.group_name}</td>
                <td>{group.owner_name}</td>
                <td>{new Date(group.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No groups found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GroupsPageGeneral;
