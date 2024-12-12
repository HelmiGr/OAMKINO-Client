import React, { useState, useEffect } from "react";
import apiClient from "../../api/api";
import { useNavigate } from "react-router-dom";
import "../../styles/groups/groupsPageGeneral.css";
import { toast } from "react-hot-toast";

const YourGroups = () => {
  const [groups, setGroups] = useState([]);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast("You need to log in to access this page.");
      navigate("/login");
      return;
    }
    const fetchYourGroups = async () => {
      try {
        const response = await apiClient.get("groups/your-groups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setGroups(response.data.groups);
      } catch (err) {
        console.error("Error fetching your groups:", err);
        alert("Failed to fetch your groups. Please try again later.");
      }
    };

    fetchYourGroups();
  }, [token]);

  return (
    <div className="groups-page-general">
      <nav className="navbar">
        <h1>Your Groups </h1>
        <div className="navbar-buttons">
          <button
            className="btn create-group"
            onClick={() => navigate("/createGroup")}
          >
            Create Group
          </button>
        </div>
      </nav>
      <table className="groups-table">
        <thead>
          <tr>
            <th>Group Name</th>
            <th>Your role</th>
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
                <td>{group.role}</td>
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

export default YourGroups;
