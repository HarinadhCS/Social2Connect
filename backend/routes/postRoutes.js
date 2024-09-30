// routes/postRoutes.js

const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer'); // For sending emails
const router = express.Router();

// Create a new post
router.post('/create', authMiddleware, async (req, res) => {
  const { title, description } = req.body;

  try {
    console.log('Creating post for user:', req.user);
    const newPost = new Post({
      title,
      description,
      user: req.user._id, // Attach the user ID of the logged-in user
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all posts
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username gender email'); // Include user details
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Discuss route
router.post('/discuss/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;

  try {
    // Find the post by ID
    const post = await Post.findById(postId).populate('user', 'gender email username');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the current user (the one who clicked the discuss button)
    const currentUser = req.user;

    // Check if the genders are opposite
    if (
      (post.user.gender === 'male' && currentUser.gender === 'female') ||
      (post.user.gender === 'female' && currentUser.gender === 'male')
    ) {
      // Genders are opposite, so generate a Zoom link
      const zoomLink = 'https://zoom.us/j/your-generated-zoom-link'; // Simulate a Zoom link

      // Send Zoom link to both users via email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // Your email credentials
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptionsPostCreator = {
        from: process.env.EMAIL_USER,
        to: post.user.email,
        subject: 'Zoom Meeting Invitation',
        text: `You have a Zoom meeting invitation with ${currentUser.username}. Here is your link: ${zoomLink}`,
      };

      const mailOptionsCurrentUser = {
        from: process.env.EMAIL_USER,
        to: currentUser.email,
        subject: 'Zoom Meeting Invitation',
        text: `You have a Zoom meeting invitation with ${post.user.username}. Here is your link: ${zoomLink}`,
      };

      // Send emails to both users
      await transporter.sendMail(mailOptionsPostCreator);
      await transporter.sendMail(mailOptionsCurrentUser);

      // Send response
      res.status(200).json({
        message: 'Zoom link sent to both users!',
        zoomLink,
      });
    } else {
      // Genders are not opposite, return a message
      res.status(400).json({ message: 'Not opposite gender' });
    }
  } catch (error) {
    console.error('Error in discuss route:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
