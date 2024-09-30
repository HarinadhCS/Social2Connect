// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import SignUp from './components/SignUp.jsx';
import SignIn from './components/SignIn.jsx';
import Posts from './components/Posts.jsx';

const Home = () => <h1>Welcome to Social2Connect</h1>;

const App = () => {
  return (
    <Router>
      <div>
        <Navbar /> {/* Navbar at the top */}
        <div className="content">
          {/* The routes will display the forms or posts below the navbar */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/posts" element={<Posts />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
