import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../styles/forum/GroupForum.css";
import GroupPost from "./GroupPost";
import GroupPostingBox from "./GroupPostingBox";
import { format } from "date-fns";
import apiClient from "../../api/api";

export default function GroupForum() {
  const { id } = useParams(); // Group ID from URL
  const currentUser = { id: 1 }; // Replace with actual logged-in user's ID
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get(`/forum/${id}`);
        console.log("Posts response:", response.data); // Log the API response
        const mappedPosts = response.data.map((post) => ({
          id: post.message_id,
          userId: post.user_id,
          groupId: post.group_id,
          userImage: "../../images/default-avatar-icon",
          userName: "User Name",
          date: format(new Date(post.timestamp), "dd.MM.yyyy 'at' HH:mm"),
          comment: post.message,
        }));
        setPosts(mappedPosts);
      } catch (error) {
        console.error(
          "Error fetching posts:",
          error.response?.data || error.message
        );
      }
    };

    fetchPosts();
  }, [id]);

  const handleDeletePost = async (postId) => {
    try {
      await apiClient.delete(`/forum/${postId}`);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEditPost = async (postId, updatedComment) => {
    try {
      await apiClient.put(`/forum/${postId}`, { message: updatedComment });
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, comment: updatedComment } : post
        )
      );
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleNewPost = async (message) => {
    try {
      const response = await apiClient.post(`/forum`, {
        message,
        user_id: currentUser.id,
        group_id: id,
      });
      const newPost = {
        id: response.data.message_id,
        userId: currentUser.id,
        groupId: id,
        userImage: "../../images/default-avatar-icon",
        userName: "User Name",
        date: format(
          new Date(response.data.timestamp),
          "dd.MM.yyyy 'at' HH:mm"
        ),
        comment: message,
      };
      setPosts([newPost, ...posts]);
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  return (
    <div className="group-forum">
      <div className="group-info">
        <h1 className="group-name">Group Name</h1>
        <p className="group-description">
          This is a brief description of the group.
        </p>
      </div>
      <div className="box-separator"></div>
      <GroupPostingBox onSubmitPost={handleNewPost} />
      <div className="box-separator"></div>
      <div className="forum-posts">
        {posts.map((post) => (
          <GroupPost
            key={post.id}
            postId={post.id}
            userImage={post.userImage}
            userName={post.userName}
            date={post.date}
            comment={post.comment}
            userId={post.userId}
            onDelete={() => handleDeletePost(post.id)}
            onEdit={handleEditPost}
            loggedInUserId={currentUser.id}
          />
        ))}
      </div>
    </div>
  );
}
