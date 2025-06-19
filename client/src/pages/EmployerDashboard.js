
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import LoadingSpinner from '../components/LoadingSpinner';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const jobsResponse = await jobService.getMyJobs();
      setJobs(jobsResponse);

      // Calculate stats
      const totalJobs = jobsResponse.length;
      const activeJobs = jobsResponse.filter(job => job.status === 'active').length;

      // Get total applications count
      let totalApplications = 0;
      for (const job of jobsResponse) {
        try {
          const applications = await applicationService.getJobApplications(job._id);
          totalApplications += applications.length;
        } catch (err) {
          console.error('Error fetching applications for job:', job._id, err);
        }
      }

      setStats({
        totalJobs,
        activeJobs,
        totalApplications
      });
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await jobService.deleteJob(jobId);
      setJobs(jobs.filter(job => job._id !== jobId));
      setStats(prev => ({
        ...prev,
        totalJobs: prev.totalJobs - 1
      }));
    } catch (err) {
      alert('Failed to delete job');
      console.error('Error deleting job:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-primary">Active</span>;
      case 'closed':
        return <span className="badge badge-secondary">Closed</span>;
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
        <div style={{ 
          marginBottom: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>
              Employer Dashboard
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>
              Welcome back, {user?.name}!
            </p>
          </div>
          <Link to="/employer/post-job" className="btn-primary">
            Post New Job
          </Link>
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
              Total Jobs
            </h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#00ffcc' }}>
              {stats.totalJobs}
            </p>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#00ffcc' }}>
              Active Jobs
            </h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#74b9ff' }}>
              {stats.activeJobs}
            </p>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#00ffcc' }}>
              Total Applications
            </h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#00ffcc' }}>
              {stats.totalApplications}
            </p>
          </div>
        </div>

        {/* Jobs List */}
        <div className="glass-card">
          <div style={{ 
            padding: '1.5rem', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '1rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#00ffcc' }}>
              My Job Postings
            </h2>
          </div>

          {error && (
            <div className="alert-error" style={{ margin: '0 1.5rem 1rem' }}>
              {error}
            </div>
          )}

          {jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>💼</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                No jobs posted yet
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem' }}>
                Create your first job posting to start receiving applications.
              </p>
              <Link to="/employer/post-job" className="btn-primary">
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              {jobs.map((job, index) => (
                <div 
                  key={job._id} 
                  className="job-card"
                  style={{ 
                    marginBottom: index === jobs.length - 1 ? '0' : '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: '1' }}>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        <Link
                          to={`/jobs/${job._id}`}
                          style={{ 
                            color: '#00ffcc', 
                            textDecoration: 'none',
                            transition: 'color 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#74b9ff'}
                          onMouseLeave={(e) => e.target.style.color = '#00ffcc'}
                        >
                          {job.title}
                        </Link>
                      </h3>
                      <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                        {job.location}
                      </p>
                      <p style={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        fontSize: '0.9rem', 
                        marginBottom: '1rem',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {job.description}
                      </p>

                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}>
                        {getStatusBadge(job.status)}
                        <span className="badge badge-secondary">
                          {job.jobType}
                        </span>
                        <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                          {job.applicationsCount || 0} applications
                        </span>
                        <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div style={{ marginLeft: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Link
                        to={`/employer/jobs/${job._id}/applicants`}
                        className="btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        View Applicants
                      </Link>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="btn-secondary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        View Job
                      </Link>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="btn-danger"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        Delete
                      </button>
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

export default EmployerDashboard;
