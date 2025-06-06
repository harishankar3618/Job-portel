import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as jobService from '../services/jobService';
import * as applicationService from '../services/applicationService';

const ApplyJob = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await jobService.getJob(id);
      setJob(response.data);
    } catch (err) {
      setError('Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!coverLetter.trim()) {
      setError('Cover letter is required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await applicationService.applyForJob({
        jobId: id,
        coverLetter,
        resume: resume || user.profile?.resume
      });
      
      navigate('/candidate-dashboard', { 
        state: { message: 'Application submitted successfully!' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Job not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Job Summary */}
          <div className="bg-blue-50 px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600">{job.company}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span>{job.location}</span>
              <span className="mx-2">•</span>
              <span className="capitalize">{job.jobType}</span>
              {job.salary?.min && (
                <>
                  <span className="mx-2">•</span>
                  <span>
                    {job.salary.currency} {job.salary.min.toLocaleString()}
                    {job.salary.max && ` - ${job.salary.max.toLocaleString()}`}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Application Form */}
          <div className="px-6 py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Apply for this position
            </h2>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Applicant Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Applicant Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 text-gray-900">{user.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 text-gray-900">{user.email}</span>
                  </div>
                  {user.profile?.phone && (
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <span className="ml-2 text-gray-900">{user.profile.phone}</span>
                    </div>
                  )}
                  {user.profile?.location && (
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <span className="ml-2 text-gray-900">{user.profile.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter *
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us why you're interested in this position and how your skills and experience make you a great fit..."
                  required
                />
              </div>

              {/* Resume URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume URL (Optional)
                </label>
                <input
                  type="url"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/your-resume.pdf"
                />
                {user.profile?.resume && !resume && (
                  <p className="mt-1 text-sm text-gray-500">
                    Your profile resume will be used: 
                    <a 
                      href={user.profile.resume} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      View Resume
                    </a>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Job Details Preview */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Description</h4>
              <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">Requirements</h4>
              <p className="text-gray-600 whitespace-pre-line">{job.requirements}</p>
            </div>

            {job.skills && job.skills.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900">Required Skills</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
