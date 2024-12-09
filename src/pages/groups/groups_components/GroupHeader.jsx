import React from "react";

const GroupHeader = ({ group, isAdmin, onDeleteGroup }) => {
  if (!group) return <div>Loading group details...</div>;

  return (
    <header>
      <h1>{group.group_name}</h1>
      {isAdmin && <p className="admin-label">Admin</p>}
      {isAdmin && (
        <button className="btn danger" onClick={onDeleteGroup}>
          Delete Group
        </button>
      )}
    </header>
  );
};

export default GroupHeader;
