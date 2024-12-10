import React from "react";

const AddToGroupMovies = ({ isOpen, onClose, onSubmit, movieTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirm Add to Group</h2>
        <p>Are you sure you want to add "{movieTitle}" to the group?</p>
        <button onClick={onSubmit}>Yes, Add</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddToGroupMovies;
