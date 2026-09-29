require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // <--- added import

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/podcastdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(' MongoDB Connected Successfully');
  } catch (error) {
    console.warn(' MongoDB Connection Warning:', error.message);
    console.log(' Running without database connection');
    console.log(' Some features will be disabled');
  }
};

connectDB();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const podcastRoutes = require('./routes/podcastRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/comments', commentRoutes);

// Serve the frontend for any other route (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Welcome to Podcast Website API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      podcasts: '/api/podcasts/*',
      comments: '/api/comments/*',
      api: 'Available at /api/*'
    }
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
==================================================
 Server running on port ${PORT}
 Environment: ${process.env.NODE_ENV || 'development'}
 URL: http://localhost:${PORT}
 Health check: http://localhost:${PORT}/api/health
==================================================
  `);
});
