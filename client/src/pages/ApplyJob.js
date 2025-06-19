import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as jobService from '../services/jobService';
import * as applicationService from '../services/applicationService';

const ApplyJob = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
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
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('coverLetter', coverLetter);

      if (resumeFile) {
        formData.append('resume', resumeFile);
      } else if (user.profile?.resume) {
        formData.append('resumeUrl', user.profile.resume);
      }

      await applicationService.applyForJob(formData);

      setSuccess('Application submitted successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '60px' }}>
        <div className="loading-spinner"></div>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#ffffff' }}>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container" style={{ paddingTop: '60px' }}>
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>❌</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '20px' }}>
            Job not found
          </h1>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '60px' }}>
      {/* Job Summary Card */}
      <div className="glass-card" style={{ padding: '30px', marginBottom: '30px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(0, 255, 204, 0.1) 0%, rgba(116, 185, 255, 0.1) 100%)',
          padding: '25px',
          borderRadius: '16px',
          marginBottom: '25px'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '900', 
            color: '#ffffff', 
            marginBottom: '10px' 
          }}>
            {job.title}
          </h1>
          <p style={{ color: '#00ffcc', fontSize: '1.2rem', marginBottom: '15px' }}>
            {job.company}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
            <span className="badge badge-secondary">📍 {job.location}</span>
            <span className="badge badge-secondary">💼 {job.jobType}</span>
            {job.salary?.min && (
              <span className="badge badge-primary">
                💰 {job.salary.currency} {job.salary.min.toLocaleString()}
                {job.salary.max && ` - ${job.salary.max.toLocaleString()}`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="form-container">
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '30px',
          background: 'linear-gradient(135deg, #00ffcc 0%, #74b9ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center'
        }}>
          Apply for this Position
        </h2>

        {error && (
          <div className="alert-error" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="alert-success" style={{ marginBottom: '20px' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Applicant Info */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            padding: '25px', 
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '30px'
          }}>
            <h3 style={{ 
              color: '#00ffcc', 
              fontSize: '1.2rem', 
              fontWeight: '600', 
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Applicant Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Name:</span>
                <span style={{ marginLeft: '10px', color: '#ffffff', fontWeight: '600' }}>{user.name}</span>
              </div>
              <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Email:</span>
                <span style={{ marginLeft: '10px', color: '#ffffff', fontWeight: '600' }}>{user.email}</span>
              </div>
              {user.profile?.phone && (
                <div>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Phone:</span>
                  <span style={{ marginLeft: '10px', color: '#ffffff', fontWeight: '600' }}>{user.profile.phone}</span>
                </div>
              )}
              {user.profile?.location && (
                <div>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Location:</span>
                  <span style={{ marginLeft: '10px', color: '#ffffff', fontWeight: '600' }}>{user.profile.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cover Letter */}
          <div className="form-group">
            <label className="form-label">Cover Letter *</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={8}
              className="glass-input"
              placeholder="Tell us why you're interested in this position and how your skills and experience make you a great fit..."
              required
              style={{ resize: 'vertical', minHeight: '200px' }}
            />
          </div>

          {/* Resume Upload */}
          <div className="form-group">
            <label className="form-label">Resume Upload (PDF, DOC) - Optional</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="glass-input"
              style={{ padding: '10px' }}
            />
            {!resumeFile && user.profile?.resume && (
              <p style={{ marginTop: '10px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                Using profile resume:
                <a
                  href={user.profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#00ffcc', textDecoration: 'none', marginLeft: '5px' }}
                  className="hover:underline"
                >
                  View Resume
                </a>
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            paddingTop: '20px',
            gap: '15px'
          }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>

      {/* Job Details Preview */}
      <div className="glass-card" style={{ padding: '30px', marginTop: '30px' }}>
        <h3 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          color: '#00ffcc', 
          marginBottom: '25px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Job Details
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div>
            <h4 style={{ color: '#ffffff', fontWeight: '600', marginBottom: '10px' }}>Description</h4>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {job.description}
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontWeight: '600', marginBottom: '10px' }}>Requirements</h4>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {job.requirements}
            </p>
          </div>

          {job.skills && job.skills.length > 0 && (
            <div>
              <h4 style={{ color: '#ffffff', fontWeight: '600', marginBottom: '15px' }}>Required Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {job.skills.map((skill, index) => (
                  <span key={index} className="badge badge-primary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
