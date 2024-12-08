import React from 'react'
import '../../styles/forum/GroupPostingBox.css'

export default function GroupPostingBox({}) {
  return (
    <div>
      <p className="posting-box-text">Add a post</p>
      <textarea className="post-area" placeholder=""></textarea>
      <div className="post-container">
        <button className="submit-post">Post</button>
      </div>
    </div>
  )
}
