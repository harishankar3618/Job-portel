
import React, { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import JobCard from '../components/JobCard';
import SearchFilters from '../components/SearchFilters';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (searchFilters = {}, page = 1) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        ...searchFilters,
        page,
        limit: 10
      };

      const response = await jobService.getAllJobs(params);
      setJobs(response.jobs);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total
      });
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    fetchJobs(searchFilters, 1);
  };

  const handlePageChange = (newPage) => {
    fetchJobs(filters, newPage);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          Find Your Dream Job
        </h1>
        <p className="hero-subtitle">
          Discover thousands of job opportunities from top companies
        </p>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Search Filters */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <SearchFilters onSearch={handleSearch} loading={loading} />
        </div>

        {/* Results Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#00ffcc' }}>
            {pagination.total > 0 ? `${pagination.total} Jobs Found` : 'No Jobs Found'}
          </h2>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert-error" style={{ marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
            <div className="loading-spinner"></div>
          </div>
        )}

        {/* Jobs List */}
        {!loading && jobs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}

        {/* No Jobs Message */}
        {!loading && jobs.length === 0 && !error && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              No jobs found
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </button>

            {[...Array(pagination.totalPages)].map((_, index) => {
              const page = index + 1;
              const isCurrentPage = page === pagination.currentPage;

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={isCurrentPage ? 'active' : ''}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
