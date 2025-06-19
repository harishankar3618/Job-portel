import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isEmployer, isCandidate } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-cyan-400 font-russo">
              JobPortal
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-white hover:text-cyan-400 px-3 py-2 transition-colors">
              Jobs
            </Link>

            {user ? (
              <>
                {isCandidate && (
                  <Link
                    to="/dashboard"
                    className="text-white hover:text-cyan-400 px-3 py-2 transition-colors"
                  >
                    My Applications
                  </Link>
                )}

                {isEmployer && (
                  <>
                    <Link
                      to="/employer/dashboard"
                      className="text-white hover:text-cyan-400 px-3 py-2 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/employer/post-job"
                      className="btn-primary"
                    >
                      Post Job
                    </Link>
                  </>
                )}

                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center text-white hover:text-cyan-400 transition-colors"
                  >
                    <span className="mr-2">{user.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass-card py-1 z-50">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:text-cyan-400 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-cyan-400 px-3 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-cyan-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass-card mt-2 rounded-lg">
              <Link
                to="/"
                className="block text-white hover:text-cyan-400 px-3 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Jobs
              </Link>

              {user ? (
                <>
                  {isCandidate && (
                    <Link
                      to="/dashboard"
                      className="block text-white hover:text-cyan-400 px-3 py-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Applications
                    </Link>
                  )}

                  {isEmployer && (
                    <>
                      <Link
                        to="/employer/dashboard"
                        className="block text-white hover:text-cyan-400 px-3 py-2 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/employer/post-job"
                        className="block text-white hover:text-cyan-400 px-3 py-2 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Post Job
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-white hover:text-cyan-400 px-3 py-2 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-white hover:text-cyan-400 px-3 py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-white hover:text-cyan-400 px-3 py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
