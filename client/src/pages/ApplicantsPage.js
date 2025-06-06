import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) {
      setError('Invalid Job ID');
      setLoading(false);
      return;
    }

    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`/api/applications/job/${jobId}`);
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

  if (loading) {
    return <div className="p-6 text-gray-700">Loading applicants...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Applicants for Job ID: <span className="text-blue-600">{jobId}</span>
      </h2>

      {applicants.length === 0 ? (
        <p className="text-gray-600">No applicants yet.</p>
      ) : (
        <ul className="space-y-4">
          {applicants.map((app) => (
            <li key={app._id} className="border border-gray-300 p-4 rounded shadow-sm bg-white">
              <p><strong>Name:</strong> {app.applicant?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {app.applicant?.email || 'N/A'}</p>
              <p><strong>Cover Letter:</strong> {app.coverLetter || 'N/A'}</p>
              {app.resume ? (
                <p>
                  <a
                    href={`http://localhost:5000${app.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Resume
                  </a>
                </p>
              ) : (
                <p><strong>Resume:</strong> Not uploaded</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApplicantsPage;
