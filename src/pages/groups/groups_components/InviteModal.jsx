import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../../../api/api";
import "../../../styles/groups/groupsPage.css";

const InviteModal = ({ groupId, token, setShowInviteModal }) => {
  const [nonMembers, setNonMembers] = useState([]); // State to hold non-members

  // Fetch non-members when the modal is opened
  useEffect(() => {
    const fetchNonMembers = async () => {
      try {
        const response = await apiClient.get(`/groups/${groupId}/non-members`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNonMembers(response.data); // Set the non-members list
      } catch (err) {
        console.error("Error fetching non-members:", err);
        toast.error("Failed to fetch non-members.");
      }
    };

    fetchNonMembers();
  }, [groupId, token]);

  // Handle inviting a user
  const handleInviteUser = async (userId) => {
    try {
      const response = await apiClient.post(
        `/groups/${groupId}/invite`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message || "User invited successfully.");
        // Remove invited user from the list
        setNonMembers((prevNonMembers) =>
          prevNonMembers.filter((user) => user.user_id !== userId)
        );
      } else {
        toast.error("Failed to invite user.");
      }
    } catch (err) {
      console.error("Error inviting user:", err);
      toast.error(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="modal">
      <div className="invite-modal">
        <h3>Invite a User</h3>
        <ul>
          {nonMembers.length === 0 ? (
            <p>No users available for invitation.</p>
          ) : (
            nonMembers.map((user) => (
              <li key={user.user_id}>
                <span>{user.user_name}</span>
                <button onClick={() => handleInviteUser(user.user_id)}>
                  Invite
                </button>
              </li>
            ))
          )}
        </ul>
        <button
          className="btn close-modal"
          onClick={() => setShowInviteModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InviteModal;
