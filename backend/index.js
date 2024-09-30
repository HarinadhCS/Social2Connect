const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');



// Load environment variables
dotenv.config();

const authRoutes = require('./routes/authRoutes'); // Auth routes (signup, signin)
const protectedRoutes = require('./routes/protectedRoutes'); // Protected routes
const postRoutes = require('./routes/postRoutes'); // Import post routes

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded images statically

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/posts', postRoutes); // Post-related routes
app.use('/api', protectedRoutes); // Protected routes

// Register post routes
app.use('/api/posts', postRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
