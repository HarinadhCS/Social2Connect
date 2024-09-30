// src/components/SignUp.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    gender: 'male',
    image: null,
  });

  const [message, setMessage] = useState(''); // For success/error messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('username', formData.username);
    form.append('email', formData.email);
    form.append('password', formData.password);
    form.append('gender', formData.gender);
    form.append('image', formData.image);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        setMessage('User registered successfully!');
        // Clear the form fields on success
        setFormData({
          username: '',
          email: '',
          password: '',
          gender: 'male',
          image: null,
        });
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Server error.'));
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      
      {/* Display success or error message */}
      {message && <p className="message">{message}</p>}
      
      <div>
        <label>Username</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
      </div>
      <div>
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>
      <div>
        <label>Gender</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div>
        <label>Profile Picture</label>
        <input type="file" name="image" onChange={handleFileChange} required />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
