import React, { useState, useEffect } from "react";
// import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/groups/groupsPage.css";
import apiClient from "../../api/api";

const GroupPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Track if the logged-in user is an admin
  const [joinRequests, setJoinRequests] = useState([]);
  const [members, setMembers] = useState([]); // List of group members
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await apiClient.get(`/groups/all/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGroup(response.data);

        // Check if the user is already a member of the group
        const membershipResponse = await apiClient.get(
          `/groups/${groupId}/membership`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsMember(membershipResponse.data.isMember);
        setIsAdmin(membershipResponse.data.role === "admin"); // Set isAdmin based on role
      } catch (err) {
        console.error("Failed to fetch group details:", err);
        alert("Failed to fetch group details. Please try again later.");
      }
    };

    fetchGroupDetails();
  }, [groupId, token]);

  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        const response = await apiClient.get(
          `/groups/${groupId}/join-requests`
        );
        setJoinRequests(response.data || []);
      } catch (err) {
        console.error("Failed to fetch join requests:", err);
        alert("Failed to fetch join requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchJoinRequests();
  }, [groupId]);

  const handleJoinGroup = async () => {
    try {
      const response = await apiClient.post(
        `/groups/${groupId}/request`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message); // Show success message from the backend
      setIsMember(false); // Set as pending member
    } catch (err) {
      console.error("Error joining the group:", err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(`Failed to send join request: ${err.response.data.error}`);
      } else {
        alert("Failed to send join request. Please try again later.");
      }
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await apiClient.post(
        `/groups/${groupId}/leave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsMember(false); // User leaves the group
      alert("Successfully left the group.");
    } catch (err) {
      console.error("Error leaving the group:", err);
      alert("Failed to leave the group.");
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await apiClient.delete(`/groups/delete/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Group deleted successfully.");
      navigate("/groups");
    } catch (err) {
      console.error("Error deleting the group:", err);
      alert("Failed to delete the group.");
    }
  };

  const handleInviteMember = () => {
    alert("Invite member functionality is not yet implemented."); // Placeholder for invite functionality
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await apiClient.get(`groups/${groupId}/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMembers(response.data); // Update members state with the fetched data
      } catch (err) {
        console.error("Failed to fetch group members:", err);
        alert("Failed to fetch group members.");
      }
    };

    fetchMembers();
  }, [groupId, token]);

  const handleAcceptRequest = async (userId) => {
    try {
      await apiClient.post(
        `/groups/${groupId}/accept`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJoinRequests((prevRequests) =>
        prevRequests.filter((req) => req.user_id !== userId)
      );

      // Fetch updated members
      const response = await apiClient.get(`/groups/${groupId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMembers(response.data); // Update members list

      alert("Request accepted.");
    } catch (err) {
      console.error("Error accepting the request:", err);
      alert("Failed to accept request.");
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      await apiClient.post(
        `/groups/${groupId}/reject`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove the rejected request from the list
      setJoinRequests((prevRequests) =>
        prevRequests.filter((req) => req.user_id !== userId)
      );

      alert("Request rejected.");
    } catch (err) {
      console.error("Error rejecting the request:", err);
      alert("Failed to reject request.");
    }
  };

  const handleDeleteMember = async (userId) => {
    try {
      await apiClient.delete(`/groups/${groupId}/members/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Remove the deleted member from the members list
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.user_id !== userId)
      );
      alert("Member removed successfully.");
    } catch (err) {
      console.error("Error removing the member:", err);
      alert("Failed to remove member.");
    }
  };

  if (!group) {
    return <div>Loading group details...</div>;
  }

  return (
    <div className="group-page container">
      <header>
        <h1>{group.group_name}</h1>
        {isAdmin && <p className="admin-label">Admin</p>}{" "}
        {/* Show "Admin" label */}
        {isAdmin && (
          <button
            className="btn danger"
            id="delete-group"
            onClick={handleDeleteGroup}
          >
            Delete Group
          </button>
        )}
      </header>

      <section className="group-info">
        <h2>Group Actions</h2>
        {!isAdmin && (
          <>
            {!isMember && (
              <button
                className="btn primary"
                id="join-group"
                onClick={handleJoinGroup}
              >
                Join Group
              </button>
            )}

            {isMember && (
              <button
                className="btn secondary"
                id="leave-group"
                onClick={handleLeaveGroup}
              >
                Leave Group
              </button>
            )}
          </>
        )}

        {isAdmin && (
          <button
            className="btn secondary"
            id="invite-member"
            onClick={handleInviteMember}
          >
            Invite Member
          </button>
        )}

        <button
          className="btn chat"
          onClick={() => (window.location.href = "chat.html")}
        >
          Chat
        </button>

        <button className="btn share-movie" id="share-movie">
          Share a Movie
        </button>
      </section>

      <section className="member-management">
        <h2>Members</h2>
        <ul className="member-list">
          {members.length === 0 ? (
            <p>No members in the group.</p>
          ) : (
            members.map((member) => (
              <li key={member.user_id}>
                <span>{member.user_email}</span>
                <span>{member.role}</span>
                {isAdmin &&
                  member.role !== "admin" && ( // Admins can delete non-admin members
                    <button
                      className="btn danger"
                      onClick={() => handleDeleteMember(member.user_id)}
                    >
                      Remove
                    </button>
                  )}
              </li>
            ))
          )}
        </ul>
      </section>

      {isAdmin && (
        <section className="join-requests">
          <h2>Join Requests</h2>
          <ul className="request-list">
            {loading ? (
              <p>Loading join requests...</p>
            ) : joinRequests.length === 0 ? (
              <p>No pending requests.</p>
            ) : (
              joinRequests.map((request) => (
                <li key={request.user_id}>
                  <span>{request.user_email}</span>
                  <span>{request.role}</span>
                  {request.status === "pending" ? (
                    <>
                      <button
                        className="btn accept"
                        onClick={() => handleAcceptRequest(request.user_id)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn reject"
                        onClick={() => handleRejectRequest(request.user_id)}
                      >
                        Reject
                      </button>
                    </>
                  ) : request.status === "accepted" ? (
                    <span className="status accepted">Accepted</span>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </section>
      )}

      {/* <section className="group-details">
        <h2>Group by: {group.admin_email}</h2>
      </section> */}
    </div>
  );
};

export default GroupPage;
