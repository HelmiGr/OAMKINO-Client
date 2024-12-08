import React, { useState, useEffect } from "react";
import GroupList from "./GroupList";
import GroupPage from "./GroupPage";
import CreateGroup from "./Creategroup";

const API_URL = "http://localhost:3000/createGroups";

const CreateGroupButton = () => {
  const [groups, setGroups] = useState([]); // List of groups
  const [user] = useState({ user_id: 2, name: "Jane Smith" }); // Simulated logged-in user, note: changed 'id' to 'user_id'
  const [currentGroup, setCurrentGroup] = useState(null);

  // Fetch all groups from the backend
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log("Fetched groups with owner_name:", data); // Verify owner_name is present
        console.log("Fetched groups:", data); // Log groups to verify the response
        setGroups(data); // Assuming data includes `group_name` and `owner_name`
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  // Add a group
  const addGroup = async (group) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          group_name: group.group_name, // Changed 'name' to 'group_name'
          owner_id: user.user_id,  // Send owner_id (user_id) to backend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error) {
          alert(errorData.error); // Show alert for duplicate name or other errors
        }
        return; // Exit the function early if an error occurs
      }

      const newGroup = await response.json();

      // Assuming the backend now returns `group_name` and `owner_id`
      setGroups([...groups, newGroup]); // Add the new group to the list
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  // Remove a group
  const removeGroup = async (groupId) => {
    try {
      await fetch(`${API_URL}/${groupId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner_id: user.user_id }), // Ensure only owner (user_id) can delete
      });

      // Update the state to remove the deleted group
      setGroups(groups.filter((group) => group.group_id !== groupId)); // Change 'id' to 'group_id'
      setCurrentGroup(null);
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  console.log("Current Group:", currentGroup); // Log currentGroup to check owner_id

  return (
    <div>
      
      {currentGroup ? (
        <GroupPage
          group={currentGroup}
          user={user}
          onBack={() => setCurrentGroup(null)}
          onDelete={removeGroup}
        />
      ) : (
        <>
          <CreateGroup onAddGroup={addGroup} user={user} />
          <GroupList groups={groups} onViewGroup={setCurrentGroup} user={user} />
        </>
      )}
    </div>
  );
};

export default CreateGroupButton;
