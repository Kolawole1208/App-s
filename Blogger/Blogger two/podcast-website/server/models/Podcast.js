const mongoose = require('mongoose');

const PodcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  audioUrl: {
    type: String,
    required: [true, 'Please upload an audio file']
  },
  duration: {
    type: Number, // Duration in seconds
    default: 0
  },
  coverImage: {
    type: String,
    default: 'default-cover.jpg'
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Technology',
      'Business',
      'Entertainment',
      'Education',
      'Health',
      'News',
      'Sports',
      'Music',
      'Other'
    ]
  },
  tags: [{
    type: String,
    trim: true
  }],
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  playsCount: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
PodcastSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Podcast', PodcastSchema);