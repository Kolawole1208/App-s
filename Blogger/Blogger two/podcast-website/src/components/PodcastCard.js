// ...existing code...
import React from 'react';
import { Link } from 'react-router-dom';
import './PodcastCard.css';

const PodcastCard = ({ podcast }) => {
  const formatViews = (views) => {
    if (!views) return 0;
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    }
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views;
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000/${url.replace(/^\/+/, '')}`;
  };

  return (
    <Link to={`/podcast/${podcast._id || podcast.id}`} className="podcast-card-link">
      <div className="podcast-card">
        <div className="card-image">
          <img
            src={getImageUrl(podcast.thumbnail)}
            alt={podcast.title || 'Podcast'}
            className="thumbnail"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
          />
          <div className="card-overlay">
            <span className="duration">{podcast.duration || '00:00'}</span>
            <div className="views-badge">
              👁️ {formatViews(podcast.views)} views
            </div>
          </div>
        </div>

        <div className="card-content">
          <div className="card-header">
            <h3 className="card-title">{podcast.title || 'Untitled'}</h3>
            <span className="category-tag">{podcast.category || 'General'}</span>
          </div>

          <p className="card-description">
            {podcast.description && podcast.description.length > 100
              ? `${podcast.description.substring(0, 100)}...`
              : podcast.description || 'No description available'}
          </p>

          <div className="card-footer">
            <div className="author-info">
              {podcast.author?.avatar ? (
                <img
                  src={getImageUrl(podcast.author.avatar)}
                  alt={podcast.author.username || 'Author'}
                  className="author-avatar"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/35x35?text=User'; }}
                />
              ) : (
                <div className="author-avatar-placeholder">
                  {podcast.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <span className="author-name">{podcast.author?.username || 'Unknown'}</span>
            </div>

            <div className="card-stats">
              <span className="stat-item">
                <span className="stat-icon">❤️</span>
                <span className="stat-count">{(podcast.likes && podcast.likes.length) || 0}</span>
              </span>
              <span className="stat-item">
                <span className="stat-icon">💬</span>
                <span className="stat-count">0</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PodcastCard;
// ...existing code...