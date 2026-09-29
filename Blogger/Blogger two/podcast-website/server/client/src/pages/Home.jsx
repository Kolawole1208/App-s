import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { podcastAPI } from '../utils/api';
import { 
  PlayIcon, 
  HeartIcon, 
  UserIcon, 
  MicrophoneIcon,
  ClockIcon,
  MusicalNoteIcon
} from '@heroicons/react/outline';

const Home = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredPodcasts, setFeaturedPodcasts] = useState([]);

  useEffect(() => {
    let mounted = true;
    
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await podcastAPI.getAll({ limit: 6 });
        
        // Handle different response shapes
        const data = res?.data ?? res;
        
        if (data?.success === false) {
          throw new Error(data.message || 'Failed to fetch podcasts');
        }
        
        // Extract podcast list from response
        const podcastList = data?.podcasts ?? data?.data ?? data ?? [];
        
        if (mounted) {
          setPodcasts(Array.isArray(podcastList) ? podcastList : []);
          setFeaturedPodcasts(Array.isArray(podcastList) ? podcastList.slice(0, 6) : []);
        }
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.message || err.message || 'Failed to load podcasts');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    fetchPodcasts();
    
    return () => { 
      mounted = false; 
    };
  }, []);

  // Format date function (fallback if date-fns is not available)
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Recent';
    }
  };

  // Format duration function
  const formatDuration = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading podcasts...</p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <div className="text-center py-12 md:py-20 bg-gradient-to-br from-primary-500 via-primary-600 to-blue-600 text-white rounded-2xl mb-12 shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Listen to Amazing
            <span className="block text-primary-200 mt-2">Podcasts</span>
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Discover, listen, and share podcasts on technology, business, entertainment, and more.
            Join our community of podcast lovers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/podcasts" 
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <PlayIcon className="h-6 w-6 inline mr-2" />
              Explore Podcasts
            </Link>
            <Link 
              to="/register" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Podcasts */}
      <div className="mb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Podcasts</h2>
            <p className="text-gray-600 mt-2">Latest episodes handpicked for you.</p>
          </div>
          <Link 
            to="/podcasts" 
            className="text-primary-600 hover:text-primary-700 font-medium mt-2 sm:mt-0"
          >
            View All →
          </Link>
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="text-red-600 my-4 p-4 bg-red-50 rounded-lg">
              <p className="font-medium">Error: {error}</p>
              <p className="text-sm mt-1">Please check your connection and try again.</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary mt-4"
            >
              Retry
            </button>
          </div>
        ) : featuredPodcasts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <MicrophoneIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No podcasts yet</h3>
            <p className="text-gray-500 mb-6">Be the first to upload a podcast!</p>
            <Link 
              to="/create-podcast" 
              className="inline-flex items-center gap-2 btn-primary px-6 py-3"
            >
              <MicrophoneIcon className="h-5 w-5" />
              Create First Podcast
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPodcasts.map((podcast) => (
              <div 
                key={podcast._id || podcast.id} 
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
              >
                <div className="p-6">
                  {/* Header with category and actions */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-wrap gap-2">
                      {podcast.category && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800">
                          {podcast.category}
                        </span>
                      )}
                      {podcast.duration && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          <ClockIcon className="h-3 w-3" />
                          {formatDuration(podcast.duration)}
                        </span>
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <HeartIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Podcast Title & Description */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      <Link to={`/podcasts/${podcast._id || podcast.id}`}>
                        {podcast.title || podcast.name || 'Untitled Podcast'}
                      </Link>
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {podcast.description || 'No description available'}
                    </p>
                  </div>
                  
                  {/* Author and Date */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      <span>{podcast.author || podcast.host?.username || 'Unknown Host'}</span>
                    </div>
                    <span>{formatDate(podcast.createdAt || podcast.date)}</span>
                  </div>
                  
                  {/* Audio Player */}
                  {podcast.audioUrl && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                        <MusicalNoteIcon className="h-4 w-4" />
                        <span>Listen Now</span>
                      </div>
                      <audio 
                        controls 
                        className="w-full h-10"
                        preload="none"
                      >
                        <source 
                          src={podcast.audioUrl.startsWith('http') 
                            ? podcast.audioUrl 
                            : `http://localhost:5000${podcast.audioUrl}`} 
                          type="audio/mpeg" 
                        />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <PlayIcon className="h-4 w-4" />
                        <span>{podcast.playsCount || 0} plays</span>
                      </div>
                      {podcast.likesCount !== undefined && (
                        <div className="flex items-center gap-1">
                          <HeartIcon className="h-4 w-4" />
                          <span>{podcast.likesCount} likes</span>
                        </div>
                      )}
                    </div>
                    <Link 
                      to={`/podcasts/${podcast._id || podcast.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
                    >
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Why Choose Our Platform
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6">
              <MicrophoneIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Create & Share</h3>
            <p className="text-gray-600">
              Easily upload and share your own podcasts with the world. Simple interface for creators.
            </p>
          </div>
          
          <div className="text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6">
              <PlayIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Listen Anywhere</h3>
            <p className="text-gray-600">
              Stream podcasts directly in your browser on any device. Mobile-friendly and responsive.
            </p>
          </div>
          
          <div className="text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-6">
              <HeartIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Connect & Engage</h3>
            <p className="text-gray-600">
              Like, comment, and interact with podcast creators and listeners. Build your community.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Start Listening?
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of listeners and creators already sharing their stories and knowledge.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/register" 
            className="btn-primary px-8 py-3 text-lg font-semibold"
          >
            Get Started For Free
          </Link>
          <Link 
            to="/podcasts" 
            className="btn-secondary px-8 py-3 text-lg font-semibold"
          >
            Browse All Podcasts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;