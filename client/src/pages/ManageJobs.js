import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
          <Link
            to="/post-job"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Post New Job
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {editingJob && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Edit Job</h2>
                <button
                  onClick={() => setEditingJob(null)}
                  className="text-gray-500 hover:text-gray-700"
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

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <li key={job._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {job.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          job.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {job.applicationsCount} applications
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span>{job.location}</span>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{job.jobType}</span>
                      <span className="mx-2">•</span>
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="ml-4 flex items-center space-x-2">
                    <Link
                      to={`/job/${job._id}/applications`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Applications
                    </Link>
                    <button
                      onClick={() => toggleJobStatus(job._id, job.isActive)}
                      className={`px-3 py-1 text-sm rounded ${
                        job.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {job.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(job)}
                      className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="bg-red-100 text-red-700 px-3 py-1 text-sm rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No jobs posted yet</p>
              <Link
                to="/post-job"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
