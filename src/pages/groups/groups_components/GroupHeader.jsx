import React from "react";

const GroupHeader = ({ group, isAdmin, onDeleteGroup }) => {
  if (!group) return <div>Loading group details...</div>;

  return (
    <header>
      <h2>Group {group.group_name}</h2>
      {isAdmin && <h2 className="admin-label">Administration</h2>}
      {isAdmin && (
        <button className="btn danger" onClick={onDeleteGroup}>
          Delete Group
        </button>
      )}
    </header>
  );
};

export default GroupHeader;
