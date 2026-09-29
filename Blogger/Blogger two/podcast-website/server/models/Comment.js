const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add content to your comment'],
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  podcast: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Podcast',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  isEdited: {
    type: Boolean,
    default: false
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
CommentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.isModified('content')) {
    this.isEdited = true;
  }
  next();
});

module.exports = mongoose.model('Comment', CommentSchema);