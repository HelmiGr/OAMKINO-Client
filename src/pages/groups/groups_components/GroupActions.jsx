import React from "react";
import { toast } from "react-hot-toast";
import apiClient from "../../../api/api";
import "../../../styles/groups/groupsPage.css";

const GroupActions = ({
  isAdmin,
  isMember,
  isInvited,
  setShowInviteModal,
  groupId,
  token,
  setIsMember,
  setIsInvited,
}) => {
  const handleJoinGroup = async () => {
    try {
      const response = await apiClient.post(
        `/groups/${groupId}/request`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Join request sent successfully.");
        setIsMember(false);
      } else {
        toast.error("Failed to send join request.");
      }
    } catch (error) {
      console.error("Error sending join request:", error);
      toast.error(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const response = await apiClient.post(
        `/groups/${groupId}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Successfully left the group.");
        setIsMember(false);

        // Reload the page
        window.location.reload();
      } else {
        toast.error("Failed to leave the group.");
      }
    } catch (error) {
      console.error("Error leaving the group:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <h2 className="group-actions-title">Group Actions</h2>
      {!isAdmin && (
        <div className="group-actions-line">
          <button className="btn primary" onClick={handleJoinGroup}>
            Join Group
          </button>
          <button className="btn secondary" onClick={handleLeaveGroup}>
            Leave Group
          </button>
        </div>
      )}
      {isAdmin && (
        <button
          className="btn secondary invited"
          onClick={() => setShowInviteModal(true)}
        >
          Invite Members
        </button>
      )}
    </>
  );
};

export default GroupActions;
