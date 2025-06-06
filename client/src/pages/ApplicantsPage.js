import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance'; // make sure axiosInstance handles auth tokens

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`/api/applications/job/${jobId}`);
        setApplicants(res.data);
      } catch (err) {
        console.error('Error fetching applicants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  if (loading) return <p>Loading applicants...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Applicants for Job ID: {jobId}</h2>
      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <ul className="space-y-4">
          {applicants.map((app) => (
            <li key={app._id} className="border p-4 rounded shadow">
              <p><strong>Name:</strong> {app.applicant.name}</p>
              <p><strong>Email:</strong> {app.applicant.email}</p>
              <p><strong>Cover Letter:</strong> {app.coverLetter}</p>
              {app.resume && (
                <p>
                  <a
                    href={app.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Resume
                  </a>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApplicantsPage;
