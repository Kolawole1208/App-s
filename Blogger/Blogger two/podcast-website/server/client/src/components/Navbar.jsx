import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  MicrophoneIcon, 
  UserCircleIcon, 
  LogoutIcon,
  LoginIcon,
  UserAddIcon,
  MenuIcon,
  XIcon 
} from '@heroicons/react/outline';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <MicrophoneIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">PodcastHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition flex items-center">
              <HomeIcon className="h-5 w-5 inline mr-1" />
              <span>Home</span>
            </Link>
            <Link to="/podcasts" className="text-gray-700 hover:text-primary-600 transition flex items-center">
              <MicrophoneIcon className="h-5 w-5 inline mr-1" />
              <span>Podcasts</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/create-podcast" className="btn-primary flex items-center">
                  <MicrophoneIcon className="h-5 w-5 inline mr-1" />
                  <span>Create Podcast</span>
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition">
                    <UserCircleIcon className="h-8 w-8" />
                    <span>{user?.username || user?.name || 'Profile'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <LogoutIcon className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-secondary flex items-center">
                  <LoginIcon className="h-5 w-5 inline mr-1" />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="btn-primary flex items-center">
                  <UserAddIcon className="h-5 w-5 inline mr-1" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link 
              to="/" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/podcasts" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Podcasts
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/create-podcast" 
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Podcast
                </Link>
                <Link 
                  to="/profile" 
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-gray-700 hover:text-primary-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;