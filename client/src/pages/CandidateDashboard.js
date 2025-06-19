import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationService } from '../services/applicationService';
import LoadingSpinner from '../components/LoadingSpinner';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationService.getMyApplications();
      setApplications(response);
    } catch (err) {
      setError('Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      await applicationService.withdrawApplication(applicationId);
      setApplications(applications.filter(app => app._id !== applicationId));
    } catch (err) {
      alert('Failed to withdraw application');
      console.error('Error withdrawing application:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-secondary">Pending</span>;
      case 'reviewing':
        return <span className="badge badge-primary">Reviewing</span>;
      case 'shortlisted':
        return <span className="badge badge-primary">Shortlisted</span>;
      case 'rejected':
        return <span className="badge badge-secondary">Rejected</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>
            Track your job applications and manage your profile
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#00ffcc' }}>
              Total Applications
            </h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#00ffcc' }}>
              {applications.length}
            </p>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#00ffcc' }}>
              Pending
            </h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#74b9ff' }}>
              {applications.filter(app => app.status === 'pending').length}
            </p>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#00ffcc' }}>
              Shortlisted
            </h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#00ffcc' }}>
              {applications.filter(app => app.status === 'shortlisted').length}
            </p>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#00ffcc' }}>
              Rejected
            </h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#ff4757' }}>
              {applications.filter(app => app.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Applications List */}
        <div className="glass-card">
          <div style={{ 
            padding: '1.5rem', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '1rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#00ffcc' }}>
              My Applications
            </h2>
          </div>

          {error && (
            <div className="alert-error" style={{ margin: '0 1.5rem 1rem' }}>
              {error}
            </div>
          )}

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>📄</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                No applications yet
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem' }}>
                Start applying for jobs to see your applications here.
              </p>
              <Link to="/" className="btn-primary">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              {applications.map((application, index) => (
                <div 
                  key={application._id} 
                  className="job-card"
                  style={{ 
                    marginBottom: index === applications.length - 1 ? '0' : '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: '1' }}>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        <Link
                          to={`/jobs/${application.job._id}`}
                          style={{ 
                            color: '#00ffcc', 
                            textDecoration: 'none',
                            transition: 'color 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#74b9ff'}
                          onMouseLeave={(e) => e.target.style.color = '#00ffcc'}
                        >
                          {application.job.title}
                        </Link>
                      </h3>
                      <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                        {application.job.company}
                      </p>
                      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                        {application.job.location}
                      </p>

                      <div style={{ 
                        marginTop: '1rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}>
                        {getStatusBadge(application.status)}
                        <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                          Applied {new Date(application.appliedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {application.notes && (
                        <div className="glass-card" style={{ 
                          marginTop: '1rem', 
                          padding: '1rem',
                          background: 'rgba(255, 255, 255, 0.05)'
                        }}>
                          <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                            <span style={{ fontWeight: '600', color: '#00ffcc' }}>Notes:</span> {application.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div style={{ marginLeft: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <Link
                        to={`/jobs/${application.job._id}`}
                        className="btn-secondary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        View Job
                      </Link>
                      {application.status === 'pending' && (
                        <button
                          onClick={() => handleWithdraw(application._id)}
                          className="btn-danger"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
