import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null); // application id updating

  useEffect(() => {
    if (!jobId) {
      setError('Invalid Job ID');
      setLoading(false);
      return;
    }

    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`/applications/job/${jobId}`);
        setApplicants(res.data);
      } catch (err) {
        console.error('Error fetching applicants:', err);
        setError('Failed to fetch applicants. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  // Handler to update status
  const updateStatus = async (applicationId, newStatus) => {
    setStatusUpdating(applicationId);
    try {
      const res = await axios.put(`/applications/${applicationId}/status`, {
        status: newStatus,
      });
      // Update local state with new status
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: res.data.status } : app
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status. Try again.');
    } finally {
      setStatusUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '60px' }}>
        <div className="loading-spinner"></div>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#ffffff' }}>
          Loading applicants...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '60px' }}>
        <div className="alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '60px' }}>
      <div className="main-container" style={{ padding: '40px' }}>
        <h2
          style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            marginBottom: '30px',
            background: 'linear-gradient(135deg, #00ffcc 0%, #74b9ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Applicants for Job ID: <span style={{ color: '#00ffcc' }}>{jobId}</span>
        </h2>

        {applicants.length === 0 ? (
          <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👥</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#ffffff' }}>
              No applicants yet
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Applications will appear here once candidates start applying.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {applicants.map((app) => (
              <div key={app._id} className="glass-card" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00ffcc 0%, #74b9ff 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        color: '#0a0a0a',
                        fontWeight: 'bold',
                      }}
                    >
                      {app.applicant?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: '1.3rem',
                          fontWeight: '600',
                          color: '#ffffff',
                          margin: 0,
                        }}
                      >
                        {app.applicant?.name || 'N/A'}
                      </h3>
                      <p style={{ color: '#00ffcc', margin: '5px 0 0 0' }}>
                        {app.applicant?.email || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h4
                      style={{
                        color: '#00ffcc',
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '10px',
                      }}
                    >
                      COVER LETTER
                    </h4>
                    <p style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6' }}>
                      {app.coverLetter || 'No cover letter provided'}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <span className="badge badge-secondary" style={{ color: '#00ffcc' }}>
                        Applied: {new Date(app.appliedAt || Date.now()).toLocaleDateString()}
                      </span>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '12px',
                          backgroundColor:
                            app.status === 'pending'
                              ? 'rgba(255, 193, 7, 0.8)' // amber
                              : app.status === 'accepted'
                              ? 'rgba(40, 167, 69, 0.8)' // green
                              : app.status === 'rejected'
                              ? 'rgba(220, 53, 69, 0.8)' // red
                              : 'rgba(119, 119, 119, 0.8)', // gray
                          color: '#fff',
                          fontWeight: '600',
                          textTransform: 'capitalize',
                          fontSize: '0.85rem',
                          userSelect: 'none',
                        }}
                      >
                        {app.status || 'Pending'}
                      </span>
                    </div>

                    {app.resume ? (
                      <a
                        href={`${process.env.REACT_APP_API_URL || ''}${app.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{ textDecoration: 'none', display: 'inline-block' }}
                      >
                        📄 View Resume
                      </a>
                    ) : (
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontStyle: 'italic',
                        }}
                      >
                        No resume uploaded
                      </span>
                    )}
                  </div>

                  {/* Action buttons for employer */}
                  <div
                    style={{
                      marginTop: '15px',
                      display: 'flex',
                      gap: '15px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {['accepted', 'rejected', 'pending'].map((statusOption) => (
                      <button
                        key={statusOption}
                        disabled={statusUpdating === app._id || app.status === statusOption}
                        onClick={() => updateStatus(app._id, statusOption)}
                        style={{
                          padding: '10px 18px',
                          borderRadius: '12px',
                          border: 'none',
                          cursor:
                            statusUpdating === app._id || app.status === statusOption
                              ? 'not-allowed'
                              : 'pointer',
                          backgroundColor:
                            statusOption === 'accepted'
                              ? '#1abc9c'
                              : statusOption === 'rejected'
                              ? '#e74c3c'
                              : '#f39c12',
                          color: '#0a0a0a',
                          fontWeight: '700',
                          fontSize: '0.9rem',
                          transition: 'background-color 0.3s ease',
                          boxShadow:
                            statusOption === 'accepted'
                              ? '0 2px 8px #16a085'
                              : statusOption === 'rejected'
                              ? '0 2px 8px #c0392b'
                              : '0 2px 8px #d35400',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor =
                            statusOption === 'accepted'
                              ? '#16a085'
                              : statusOption === 'rejected'
                              ? '#c0392b'
                              : '#d35400';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor =
                            statusOption === 'accepted'
                              ? '#1abc9c'
                              : statusOption === 'rejected'
                              ? '#e74c3c'
                              : '#f39c12';
                        }}
                      >
                        {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsPage;
