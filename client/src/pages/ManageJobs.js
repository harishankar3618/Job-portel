import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as jobService from '../services/jobService';
import JobForm from '../components/JobForm';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingJob, setEditingJob] = useState(null);
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobService.getEmployerJobs();
      setJobs(response.data);
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
  };

  const handleUpdate = async (jobData) => {
    setUpdating(true);
    setError('');

    try {
      const response = await jobService.updateJob(editingJob._id, jobData);
      setJobs(jobs.map(job =>
        job._id === editingJob._id ? response.data : job
      ));
      setEditingJob(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await jobService.deleteJob(jobId);
      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (err) {
      setError('Failed to delete job');
    }
  };

  const toggleJobStatus = async (jobId, currentStatus) => {
    try {
      const response = await jobService.updateJob(jobId, { isActive: !currentStatus });
      setJobs(jobs.map(job =>
        job._id === jobId ? response.data : job
      ));
    } catch (err) {
      setError('Failed to update job status');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="loading-spinner"></div>
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Manage Jobs</h1>
          <Link
            to="/post-job"
            className="btn-primary"
          >
            Post New Job
          </Link>
        </div>

        {error && (
          <div className="alert-error mb-6">
            {error}
          </div>
        )}

        {editingJob && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-card max-w-3xl w-full max-h-screen overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Job</h2>
                <button
                  onClick={() => setEditingJob(null)}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <JobForm
                initialData={editingJob}
                onSubmit={handleUpdate}
                loading={updating}
                submitText="Update Job"
              />
            </div>
          </div>
        )}

        <div className="glass-card overflow-hidden">
          <div className="divide-y divide-white/10">
            {jobs.map((job) => (
              <div key={job._id} className="job-card border-none rounded-none">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-white">
                        {job.title}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className={`badge ${
                          job.isActive
                            ? 'badge-primary'
                            : 'badge-secondary'
                        }`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-sm text-gray-300">
                          {job.applicationsCount} applications
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-400 mb-3">
                      <span>{job.location}</span>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{job.jobType}</span>
                      <span className="mx-2">•</span>
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="ml-6 flex items-center space-x-3">
                    <Link
                      to={`/job/${job._id}/applications`}
                      className="text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-colors"
                    >
                      View Applications
                    </Link>
                    <button
                      onClick={() => toggleJobStatus(job._id, job.isActive)}
                      className={`btn-secondary text-xs ${
                        job.isActive
                          ? 'hover:bg-red-500/20 hover:border-red-400'
                          : 'hover:bg-green-500/20 hover:border-green-400'
                      }`}
                    >
                      {job.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(job)}
                      className="btn-secondary text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="btn-danger text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-6 text-lg">No jobs posted yet</p>
              <Link
                to="/post-job"
                className="btn-primary"
              >
                Post Your First Job
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
