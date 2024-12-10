import React from 'react';
import EditProfile from './EditProfile';
import './EditProfileButton.css';

function EditProfileButton() {
    return (
        <div className="EditProfileButton">
            <h1>Edit Profile Example</h1>
            {/* Replace 1 with actual userId */}
            <EditProfile userId={1} />
        </div>
    );
}

export default EditProfileButton;
