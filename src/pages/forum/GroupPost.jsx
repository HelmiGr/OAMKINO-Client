import React, {useState} from 'react';
import '../../styles/forum/GroupPost.css'; 

export default function GroupPost({ postId, userImage, userName, date, comment, onDelete, onEdit, userId, loggedInUserId }) {

  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment);  

  const handleEditClick = () => {
    setIsEditing(true); 
  };

  const handleCancelEdit = () => {
    setIsEditing(false); 
    setEditedComment(comment); 
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    onEdit(postId, editedComment); 
  };

  const handleChange = (event) => {
    setEditedComment(event.target.value); 
  };

  const canEditOrDelete = userId === loggedInUserId;

  return (
    <div className="group-post">
      <div className="post-header">
        <div className="user"> 
          <div className="user-image">
            <img src={userImage} alt=""/>
          </div>
          <div className="user-meta">
            <div className="name">{userName}</div>
            <div className="day">{date}</div>
          </div>
        </div>
        {canEditOrDelete && (
        <div className="actions">
          <div className="edit icon" onClick={handleEditClick}><i className="fa-solid fa-pen"></i></div>
          <div className="delete icon" onClick={() => onDelete(postId)}><i className="fa-solid fa-trash"></i></div>
        </div>
        )}
      </div>
      
      <div className="post-content">
      {isEditing ? (
          <div>
            <textarea
              className="editing-textarea"
              value={editedComment}
              onChange={handleChange}
              rows="4"
              cols="50"
            />
            <div className="editing-button">
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={handleCancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          <p>{comment}</p>
        )}
      </div>
    </div>
  );
}

