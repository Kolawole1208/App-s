import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Podcasts from './pages/Podcasts';
import PodcastDetail from './pages/PodcastDetail';
import CreatePodcast from './pages/CreatePodcast';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/podcasts" element={<Podcasts />} />
              <Route path="/podcasts/:id" element={<PodcastDetail />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/create-podcast" 
                element={
                  <PrivateRoute>
                    <CreatePodcast />
                  </PrivateRoute>
                } 
              />
              
              {/* Fallback route for 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <footer className="bg-gray-800 text-white py-8 mt-auto">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold">PodcastHub</h2>
                  <p className="text-gray-400">Listen, Learn, Inspire</p>
                </div>
                <div className="flex space-x-6">
                  <a href="/about" className="text-gray-400 hover:text-white transition">About</a>
                  <a href="/contact" className="text-gray-400 hover:text-white transition">Contact</a>
                  <a href="/privacy" className="text-gray-400 hover:text-white transition">Privacy</a>
                  <a href="/terms" className="text-gray-400 hover:text-white transition">Terms</a>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} PodcastHub. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;