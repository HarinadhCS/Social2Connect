// src/components/Posts.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Posts.css';

const Posts = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]); // To store the fetched posts
  const [discussMessage, setDiscussMessage] = useState('');
  const [zoomLink, setZoomLink] = useState(null); // To store Zoom link if generated

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('You must be logged in to create a post.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/posts/create',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        setMessage('Post created successfully!');
        setFormData({
          title: '',
          description: ''
        });
        fetchPosts(); // Re-fetch posts after creating a new one
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Server error.'));
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setPosts(response.data); // Store the posts
    } catch (error) {
      setMessage('Failed to load posts. Please try again.');
    }
  };

  const handleDiscuss = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/discuss/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setDiscussMessage('Opposite genders!');
        setZoomLink(response.data.zoomLink); // Store the Zoom link
      } else {
        setDiscussMessage(response.data.message);
      }
    } catch (error) {
      setDiscussMessage('Error: ' + (error.response?.data?.message || 'Server error.'));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="posts-section">
      <form className="post-form" onSubmit={handleSubmit}>
        <h2>Create Post</h2>
        {message && <p className={`message ${message.includes('Error') ? 'error' : ''}`}>{message}</p>}

        <div>
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <button type="submit">Create Post</button>
      </form>

      <div className="post-list">
        <h2>All Posts</h2>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <div className="post-item" key={post._id}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <p>Posted by: {post.user?.username || 'Anonymous'}</p>
              <button className="discuss-button" onClick={() => handleDiscuss(post._id)}>
                Discuss
              </button>
            </div>
          ))
        )}
      </div>

      {/* Display message after Discuss button click */}
      {discussMessage && <p className="discuss-message">{discussMessage}</p>}

      {/* Display Zoom link if available */}
      {zoomLink && (
        <p>
          Zoom Link: <a href={zoomLink} target="_blank" rel="noopener noreferrer">{zoomLink}</a>
        </p>
      )}
    </div>
  );
};

export default Posts;
