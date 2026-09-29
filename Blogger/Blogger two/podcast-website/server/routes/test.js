// ...existing code...
const express = require('express');
const router = express.Router();

// Test route
router.get('/', (req, res) => {
  res.json({
    message: 'API is working!',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me',
        update: 'PUT /api/auth/update'
      },
      podcasts: {
        getAll: 'GET /api/podcasts',
        getOne: 'GET /api/podcasts/:id',
        create: 'POST /api/podcasts',
        update: 'PUT /api/podcasts/:id',
        delete: 'DELETE /api/podcasts/:id',
        like: 'PUT /api/podcasts/:id/like'
      },
      comments: {
        getByPodcast: 'GET /api/comments/podcast/:podcastId',
        create: 'POST /api/comments',
        update: 'PUT /api/comments/:id',
        delete: 'DELETE /api/comments/:id',
        like: 'PUT /api/comments/:id/like'
      }
    }
  });
});

module.exports = router;
// ...existing code...