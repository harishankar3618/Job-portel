import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import LoadingSpinner from '../components/LoadingSpinner';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCandidate } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null,
  });
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (isCandidate) {
      checkApplicationStatus();
    }
  }, [id, isCandidate]);

  const fetchJobDetails = async () => {
    try {
      const response = await jobService.getJobById(id);
      setJob(response);
    } catch (err) {
      setError('Failed to fetch job details');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const applications = await applicationService.getMyApplications();
      const applied = applications.some(app => app.job._id === id);
      setHasApplied(applied);
    } catch (err) {
      console.error('Error checking application status:', err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!applicationData.resume) {
      setError('Please upload your resume.');
      return;
    }

    try {
      setApplying(true);
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('coverLetter', applicationData.coverLetter);
      formData.append('resume', applicationData.resume);

      await applicationService.applyForJob(formData);

      setHasApplied(true);
      alert('Application submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Salary not specified';

    if (salary.min && salary.max) {
      return `${salary.currency || 'USD'} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
    } else if (salary.min) {
      return `${salary.currency || 'USD'} ${salary.min.toLocaleString()}+`;
    } else {
      return `Up to ${salary.currency || 'USD'} ${salary.max.toLocaleString()}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <p className="text-xl mb-2">{job.company}</p>
                <p className="text-primary-100">{job.location}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  job.jobType === 'full-time' ? 'bg-green-500' :
                  job.jobType === 'part-time' ? 'bg-blue-500' :
                  job.jobType === 'contract' ? 'bg-yellow-500' :
                  'bg-purple-500'
                } text-white`}>
                  {job.jobType}
                </span>
                <div className="mt-2 text-primary-100">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </div>

                {job.requirements && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h3>
                    <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Salary</p>
                      <p className="text-lg font-semibold text-gray-900">{formatSalary(job.salary)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Job Type</p>
                      <p className="text-gray-900 capitalize">{job.jobType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Location</p>
                      <p className="text-gray-900">{job.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Company</p>
                      <p className="text-gray-900">{job.company}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Applications</p>
                      <p className="text-gray-900">{job.applicationsCount || 0} applicants</p>
                    </div>
                  </div>

                  {isCandidate && (
                    <div className="mt-6">
                      {hasApplied ? (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                          <p className="font-medium">Already Applied</p>
                          <p className="text-sm">You have already applied for this position.</p>
                        </div>
                      ) : (
                        <form onSubmit={handleApply} className="space-y-4" encType="multipart/form-data">
                          <div>
                            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                              Cover Letter
                            </label>
                            <textarea
                              id="coverLetter"
                              name="coverLetter"
                              rows="4"
                              value={applicationData.coverLetter}
                              onChange={(e) =>
                                setApplicationData({ ...applicationData, coverLetter: e.target.value })
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              placeholder="Write a brief cover letter..."
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                              Upload Resume (PDF)
                            </label>
                            <input
                              type="file"
                              id="resume"
                              name="resume"
                              accept=".pdf"
                              onChange={(e) =>
                                setApplicationData({ ...applicationData, resume: e.target.files[0] })
                              }
                              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm"
                              required
                            />
                          </div>

                          {error && <p className="text-red-600 text-sm">{error}</p>}

                          <button
                            type="submit"
                            disabled={applying}
                            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {applying ? 'Applying...' : 'Apply Now'}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {!user && (
                    <div className="mt-6">
                      <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Login to Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
