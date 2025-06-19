import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetails from './pages/JobDetails';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJob from './pages/PostJob';
import ApplicantsPage from './pages/ApplicantsPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

// Particle Background Component
const ParticleBackground = () => {
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size between 2-8px
      const size = Math.random() * 6 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random animation duration
      particle.style.animationDuration = `${Math.random() * 3 + 3}s`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      
      return particle;
    };

    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
      // Create 50 particles
      for (let i = 0; i < 50; i++) {
        const particle = createParticle();
        particlesContainer.appendChild(particle);
      }
    }

    // Cleanup function
    return () => {
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
      }
    };
  }, []);

  return <div className="particles-container"></div>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Particle Background */}
          <ParticleBackground />
          
          {/* Navigation */}
          <Navbar />
          
          {/* Main Content */}
          <div className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs/:id" element={<JobDetails />} />

              {/* Candidate Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <CandidateDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Employer Dashboard (Main and alias path) */}
              <Route
                path="/employer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Post Job (Employer only) */}
              <Route
                path="/employer/post-job"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <PostJob />
                  </ProtectedRoute>
                }
              />

              {/* View Applicants for a Specific Job */}
              <Route
                path="/employer/jobs/:jobId/applicants"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <ApplicantsPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
