import React from "react";
import "../../../styles/groups/groupsPage.css";

const MembersSection = ({ members, isAdmin, handleDeleteMember }) => {
  return (
    <section className="member-management">
      <h2>Members</h2>
      <ul className="member-list">
        {members.length === 0 ? (
          <p>No members in the group.</p>
        ) : (
          members.map((member) => {
            return (
              <li key={member.user_id}>
                <span>{member.user_name}</span>
                <span>{member.role}</span>
                {isAdmin && member.role !== "admin" && (
                  <button
                    className="btn danger"
                    onClick={() => handleDeleteMember(member.user_id)}
                  >
                    Remove
                  </button>
                )}
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
};

export default MembersSection;
