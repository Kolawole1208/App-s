const express = require('express');
const router = express.Router();
const Podcast = require('../models/Podcast');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/podcasts
// @desc    Get all podcasts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    let query = { isPublished: true };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search in title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    const podcasts = await Podcast.find(query)
      .populate('host', 'username avatar')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Podcast.countDocuments(query);
    
    res.json({
      success: true,
      count: podcasts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      podcasts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   GET /api/podcasts/:id
// @desc    Get single podcast
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id)
      .populate('host', 'username avatar bio')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username avatar'
        }
      });
    
    if (!podcast) {
      return res.status(404).json({
        success: false,
        error: 'Podcast not found'
      });
    }
    
    // Increment play count
    podcast.playsCount += 1;
    await podcast.save();
    
    res.json({
      success: true,
      podcast
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   POST /api/podcasts
// @desc    Create a podcast
// @access  Private
router.post('/', protect, upload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an audio file'
      });
    }
    
    const podcastData = {
      ...req.body,
      audioUrl: `/uploads/${req.file.filename}`,
      host: req.user.id
    };
    
    const podcast = await Podcast.create(podcastData);
    
    res.status(201).json({
      success: true,
      podcast
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   PUT /api/podcasts/:id
// @desc    Update a podcast
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let podcast = await Podcast.findById(req.params.id);
    
    if (!podcast) {
      return res.status(404).json({
        success: false,
        error: 'Podcast not found'
      });
    }
    
    // Check ownership
    if (podcast.host.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this podcast'
      });
    }
    
    podcast = await Podcast.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      podcast
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   DELETE /api/podcasts/:id
// @desc    Delete a podcast
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    
    if (!podcast) {
      return res.status(404).json({
        success: false,
        error: 'Podcast not found'
      });
    }
    
    // Check ownership or admin
    if (podcast.host.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this podcast'
      });
    }
    
    await podcast.deleteOne();
    
    res.json({
      success: true,
      message: 'Podcast deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   PUT /api/podcasts/:id/like
// @desc    Like/unlike a podcast
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    
    if (!podcast) {
      return res.status(404).json({
        success: false,
        error: 'Podcast not found'
      });
    }
    
    const isLiked = podcast.likes.includes(req.user.id);
    
    if (isLiked) {
      // Unlike
      podcast.likes = podcast.likes.filter(
        id => id.toString() !== req.user.id
      );
      podcast.likesCount = podcast.likes.length;
    } else {
      // Like
      podcast.likes.push(req.user.id);
      podcast.likesCount = podcast.likes.length;
    }
    
    await podcast.save();
    
    res.json({
      success: true,
      isLiked: !isLiked,
      likesCount: podcast.likesCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;