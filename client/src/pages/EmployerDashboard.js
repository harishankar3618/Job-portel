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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
          </div>
          <Link
            to="/employer/post-job"
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Post New Job
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Jobs</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.totalJobs}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Jobs</h3>
            <p className="text-3xl font-bold text-green-600">{stats.activeJobs}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Applications</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalApplications}</p>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Job Postings</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-6 mt-4 rounded-md">
              {error}
            </div>
          )}

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
              <p className="text-gray-600 mb-4">Create your first job posting to start receiving applications.</p>
              <Link
                to="/employer/post-job"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <div key={job._id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="hover:text-primary-600"
                        >
                          {job.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-2">{job.location}</p>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {job.description}
                      </p>
                      
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'active' ? 'bg-green-100 text-green-800' :
                          job.status === 'closed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {job.jobType}
                        </span>
                        <span className="text-sm text-gray-500">
                          {job.applicationsCount || 0} applications
                        </span>
                        <span className="text-sm text-gray-500">
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex space-x-2">
                      <Link
                        to={`/employer/jobs/${job._id}/applicants`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View Applicants
                      </Link>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                      >
                        View Job
                      </Link>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
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
