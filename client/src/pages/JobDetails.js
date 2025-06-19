
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
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center glass-card p-8">
          <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <div className="glass-card overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-filter backdrop-blur-lg p-6 border-b border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">{job.title}</h1>
                <p className="text-xl mb-2 text-cyan-300">{job.company}</p>
                <p className="text-gray-300">{job.location}</p>
              </div>
              <div className="text-right">
                <span className={`badge ${
                  job.jobType === 'full-time' ? 'badge-primary' :
                  job.jobType === 'part-time' ? 'badge-secondary' :
                  job.jobType === 'contract' ? 'badge-secondary' :
                  'badge-secondary'
                }`}>
                  {job.jobType}
                </span>
                <div className="mt-2 text-gray-300">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Job Description</h2>
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed">{job.description}</p>
                </div>

                {job.requirements && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-3">Requirements</h3>
                    <p className="text-gray-300 whitespace-pre-line leading-relaxed">{job.requirements}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="badge badge-secondary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Job Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-cyan-300">Salary</p>
                      <p className="text-lg font-semibold text-white">{formatSalary(job.salary)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-cyan-300">Job Type</p>
                      <p className="text-white capitalize">{job.jobType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-cyan-300">Location</p>
                      <p className="text-white">{job.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-cyan-300">Company</p>
                      <p className="text-white">{job.company}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-cyan-300">Applications</p>
                      <p className="text-white">{job.applicationsCount || 0} applicants</p>
                    </div>
                  </div>

                  {isCandidate && (
                    <div className="mt-6">
                      {hasApplied ? (
                        <div className="alert-success">
                          <p className="font-medium">Already Applied</p>
                          <p className="text-sm">You have already applied for this position.</p>
                        </div>
                      ) : (
                        <form onSubmit={handleApply} className="space-y-4" encType="multipart/form-data">
                          <div>
                            <label htmlFor="coverLetter" className="form-label">
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
                              className="glass-input"
                              placeholder="Write a brief cover letter..."
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="resume" className="form-label">
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
                              className="glass-input"
                              required
                            />
                          </div>

                          {error && <div className="alert-error">{error}</div>}

                          <button
                            type="submit"
                            disabled={applying}
                            className="btn-primary w-full"
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
                        className="btn-primary w-full"
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
