// ...existing code...
import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import PodcastCard from '../components/PodcastCard';
import './Home.css';

const Home = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories] = useState([
    'All', 'Technology', 'Business', 'Health', 'Entertainment', 'Education'
  ]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchPodcasts();
  }, [selectedCategory]);

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      setError('');

      let url = '/podcasts';
      if (selectedCategory !== 'All') {
        url += `?category=${encodeURIComponent(selectedCategory)}`;
      }

      const response = await api.get(url);
      setPodcasts(response.data.podcasts || []);
    } catch (err) {
      setError('Failed to fetch podcasts. Please try again.');
      console.error('Error fetching podcasts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content container">
          <h1>Listen to Amazing Podcasts</h1>
          <p>Discover, listen, and engage with our collection of podcasts from creators worldwide</p>
          <div className="hero-search">
            <input
              type="text"
              placeholder="Search for podcasts, topics, or creators..."
              className="hero-search-input"
            />
            <button className="hero-search-btn btn btn-primary">Search</button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section container">
        <h2>Browse by Category</h2>
        <div className="categories-list">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn btn ${selectedCategory === category ? 'active' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Podcasts Grid */}
      <section className="podcasts-section container">
        <div className="section-header">
          <h2>Featured Podcasts</h2>
          <div className="sort-options">
            <select className="sort-select">
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading podcasts...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message error">{error}</p>
            <button onClick={fetchPodcasts} className="retry-btn btn btn-primary">
              Try Again
            </button>
          </div>
        ) : podcasts.length === 0 ? (
          <div className="empty-state">
            <p>No podcasts found in this category.</p>
          </div>
        ) : (
          <div className="podcasts-grid">
            {podcasts.map(podcast => (
              <PodcastCard key={podcast._id || podcast.id} podcast={podcast} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Section */}
      <section className="featured-section container">
        <h2>Why Choose PodcastHub?</h2>
        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon">🎧</div>
            <h3>High Quality Audio</h3>
            <p>Crystal clear audio quality for the best listening experience.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">💬</div>
            <h3>Community Engagement</h3>
            <p>Join discussions, comment, and interact with creators.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Listen on any device, anywhere, anytime.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">🚀</div>
            <h3>Easy Upload</h3>
            <p>Simple process for creators to share their content.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
// ...existing code...