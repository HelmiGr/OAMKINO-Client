import React, { useState, useEffect } from 'react';
import './EditProfile.css'; // Custom styling

// Configuration
const config = { 
    API_URL: 'http://localhost:3001', // Backend URL
};

const EditProfile = ({ userId }) => {
    const [userData, setUserData] = useState({ user_name: '', email: '', profile_pic: '' });
    const [isEditing, setIsEditing] = useState(false);

    // Fetch user data by user_id
    useEffect(() => {
        if (isEditing) {
            fetch(`${config.API_URL}/user/${userId}`)
                .then((res) => res.json())
                .then((data) => setUserData(data))
                .catch((err) => console.error('Error fetching user data:', err));
        }
    }, [isEditing, userId]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${config.API_URL}/user/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        })
            .then(() => {
                alert('Profile updated successfully');
                setIsEditing(false);
            })
            .catch((err) => console.error('Error updating user:', err));
    };

    return (
        <div className="edit-profile">
            {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="edit-btn">
                    Edit Profile
                </button>
            ) : (
                <form onSubmit={handleSubmit} className="edit-form">
                    <label>
                        User Name:
                        <input
                            type="text"
                            value={userData.user_name}
                            onChange={(e) => setUserData({ ...userData, user_name: e.target.value })}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        />
                    </label>
                    <label>
                        Profile Picture URL:
                        <input
                            type="text"
                            value={userData.profile_pic}
                            onChange={(e) =>
                                setUserData({ ...userData, profile_pic: e.target.value })
                            }
                        />
                    </label>
                    <button type="submit">Save</button>
                    <button onClick={() => setIsEditing(false)} className="cancel-btn">
                        Cancel
                    </button>
                </form>
            )}
        </div>
    );
};

export default EditProfile;
