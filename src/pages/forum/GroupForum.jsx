import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/forum/GroupForum.css';
import GroupPost from './GroupPost'; 
import GroupPostingBox from './GroupPostingBox';
import { format } from 'date-fns';
import apiClient from '../../api/api';

// route will be /forum/:groupId

export default function GroupForum() {
  // get groupId from the url
  const { id } = useParams();

  // so each user can only edit and delete their own posts
  const currentUser = { id: 1 }; // need to get actual logged-in user's ID!

  const [posts, setPosts] = useState([]);

  // fetch posts from the server once the page loads
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // fetch posts for the specific group
        const response = await apiClient.get(`/forum/${id}`);

        const mappedPosts = response.data.map(post => ({
            id: post.message_id, 
            userId: post.user_id,
            groupId: post.group_id,
            userImage: '../../images/default-avatar-icon', // if we want to add a user image
            userName: 'User Name', // if we want a username
            date: format(new Date(post.timestamp), 'dd.MM.yyyy \'at\' HH:mm'), 
            comment: post.message, 
        }));

        setPosts(mappedPosts); // add these posts to the posts state
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [id]); // re-run fetch if groupId changes

  // takes the id of the post and deletes it
  const handleDeletePost = async (id) => {
    try {
      // sends a delete req to the wanted URL (deletes post from db)
      await apiClient.delete(`/forum/${id}`);
      // deletes post from the app
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // function to handle editing the post
  const handleEditPost = async (id, updatedComment) => {
    try {
      // send the updated comment to the server via PUT
      await apiClient.put(`/forum/${id}`, { message: updatedComment });

      // update the post in the local state
      setPosts(posts.map(post =>
        post.id === id ? { ...post, comment: updatedComment } : post
      ));
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div className="group-forum"> 
      <div className="group-info">
       <h1 className="group-name">Group Name</h1>
       <p className="group-description">This is a brief description of the group. description text description text!</p>
      </div>
      <div className="box-separator"></div>
      <form className="make-a-post-box">
         <GroupPostingBox/>
      </form>
      <div className="box-separator"></div>
      <div className="forum-posts"> 
        {posts.map((post, index) => (
          <GroupPost
            key={post.id}
            postId={post.id}
            userImage='./Kayla-Person' // change if we want to add a picture
            userName={post.userName}
            date={post.date}
            comment={post.comment}
            userId={post.userId}
            groupId={post.groupId}
            onDelete={() => handleDeletePost(post.id)} 
            onEdit={handleEditPost}
            loggedInUserId={currentUser.id}
          />
        ))}
      </div>
    </div>
  );
}
