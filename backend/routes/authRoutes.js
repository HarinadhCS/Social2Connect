const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/User');
const { validateGenderPhoto } = require('../mlModel'); // Placeholder for ML model
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Setup image upload using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});



const upload = multer({ storage });
// authRoutes.js
//sign up 
// Signup route
router.post('/signup', upload.single('image'), async (req, res) => {
  const { username, password, gender, email } = req.body; // Add email field

  try {
    // Check if username already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Validate gender with the ML model and uploaded image
    const isValid = await validateGenderPhoto(req.file.path, gender).catch(err => {
      console.error("Error validating gender photo:", err);
      res.status(500).json({ message: "Error validating photo" });
      return;  // Ensure no further execution after an error response
    });

    if (typeof isValid === "undefined") {
      // If an error occurred, avoid proceeding
      return;
    }

    if (!isValid) {
      // If gender and photo don't match, delete uploaded image and return early
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Gender and photo do not match' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({
      username,
      password: hashedPassword,
      gender,
      email, // Include email field in the user creation
      imagePath: req.file.path,
    });

    await newUser.save();

    // Create a JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the success response
    return res.status(201).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Sign-in route
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
