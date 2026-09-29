const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Podcast = require('../models/Podcast');
const { protect } = require('../middleware/auth');

// @route   GET /api/comments/podcast/:podcastId
// @desc    Get comments for a podcast
// @access  Public
router.get('/podcast/:podcastId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      podcast: req.params.podcastId,
      parentComment: null 
    })
      .populate('user', 'username avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'user',
          select: 'username avatar'
        }
      })
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: comments.length,
      comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   POST /api/comments
// @desc    Create a comment
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { content, podcastId, parentCommentId } = req.body;
    
    // Check if podcast exists
    const podcast = await Podcast.findById(podcastId);
    if (!podcast) {
      return res.status(404).json({
        success: false,
        error: 'Podcast not found'
      });
    }
    
    // If replying, check if parent comment exists
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          error: 'Parent comment not found'
        });
      }
    }
    
    const comment = await Comment.create({
      content,
      podcast: podcastId,
      user: req.user.id,
      parentComment: parentCommentId || null
    });
    
    // Populate user info
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username avatar');
    
    res.status(201).json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   PUT /api/comments/:id
// @desc    Update a comment
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    // Check ownership
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this comment'
      });
    }
    
    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true, runValidators: true }
    ).populate('user', 'username avatar');
    
    res.json({
      success: true,
      comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    // Check ownership or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this comment'
      });
    }
    
    // Also delete replies if any
    await Comment.deleteMany({ parentComment: comment._id });
    
    await comment.deleteOne();
    
    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   PUT /api/comments/:id/like
// @desc    Like/unlike a comment
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    const isLiked = comment.likes.includes(req.user.id);
    
    if (isLiked) {
      // Unlike
      comment.likes = comment.likes.filter(
        id => id.toString() !== req.user.id
      );
    } else {
      // Like
      comment.likes.push(req.user.id);
    }
    
    await comment.save();
    
    res.json({
      success: true,
      isLiked: !isLiked,
      likesCount: comment.likes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;