import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import JobForm from '../components/JobForm';
import { jobService } from '../services/jobService';

const PostJob = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleSubmit = async (jobData) => {
    setLoading(true);
    setError('');
    try {
      await jobService.createJob(jobData);
      navigate('/employer-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <div className="form-container">
          <h1 className="hero-title text-center mb-8" style={{ fontSize: '2.5rem' }}>
            Post a New Job
          </h1>
          
          {error && (
            <div className="alert-error mb-6">
              {error}
            </div>
          )}
          
          <JobForm
            onSubmit={handleSubmit}
            loading={loading}
            submitText="Post Job"
          />
        </div>
      </div>
    </div>
  );
};

export default PostJob;
