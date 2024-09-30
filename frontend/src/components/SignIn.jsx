// src/components/SignIn.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './SignIn.css';

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [message, setMessage] = useState(''); // For success/error messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SignIn form submission triggered");

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', formData);

      if (response.status === 200) {
        console.log("Logged in successfully");
        localStorage.setItem('token', response.data.token); // Save the token to local storage
        setMessage('Logged in successfully!');
        // Clear the form fields on success
        setFormData({
          username: '',
          password: ''
        });
      } else {
        setMessage('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.log("Error during sign-in: ", error);
      setMessage('Error: ' + (error.response?.data?.message || 'Server error.'));
    }
  };

  return (
    <form className="signin-form" onSubmit={handleSubmit}>
      <h2>Sign In</h2>

      {/* Display success or error message */}
      {message && <p className={`message ${message.includes('Error') ? 'error' : ''}`}>{message}</p>}

      <div>
        <label>Username</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignIn;
