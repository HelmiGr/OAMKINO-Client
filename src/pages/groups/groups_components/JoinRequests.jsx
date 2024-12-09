import React from "react";
import { toast } from "react-hot-toast";
import apiClient from "../../../api/api";
import "../../../styles/groups/groupsPage.css";

const JoinRequests = ({
  joinRequests,
  groupId,
  token,
  setJoinRequests,
  setMembers,
}) => {
  const handleAcceptRequest = async (userId) => {
    try {
      const response = await apiClient.post(
        `/groups/${groupId}/accept`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const acceptedUser = joinRequests.find((req) => req.user_id === userId);
        setMembers((prevMembers) => [...prevMembers, acceptedUser]);
        setJoinRequests((prevRequests) =>
          prevRequests.filter((req) => req.user_id !== userId)
        );
        toast.success("Request accepted successfully.");
      }
    } catch (error) {
      console.error("Error accepting join request:", error);
      toast.error("Failed to accept the request.");
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      const response = await apiClient.post(
        `/groups/${groupId}/reject`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setJoinRequests((prevRequests) =>
          prevRequests.filter((req) => req.user_id !== userId)
        );
        toast.success("Request rejected successfully.");
      }
    } catch (error) {
      console.error("Error rejecting join request:", error);
      toast.error("Failed to reject the request.");
    }
  };

  return (
    <section className="join-requests">
      <h2>Join Requests</h2>
      {joinRequests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {joinRequests.map((request) => (
            <li key={request.user_id}>
              <span>{request.user_name}</span>
              <button
                className="accept"
                onClick={() => handleAcceptRequest(request.user_id)}
              >
                Accept
              </button>
              <button
                className="reject"
                onClick={() => handleRejectRequest(request.user_id)}
              >
                Reject
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default JoinRequests;
