import React from 'react';
import { Link } from 'react-router-dom';

const ApplicationCard = ({ application, userRole = 'candidate', onStatusChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(application._id, newStatus);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {userRole === 'candidate' ? (
            <>
              <h3 className="text-lg font-semibold text-gray-900">
                <Link 
                  to={`/job/${application.job._id}`}
                  className="hover:text-blue-600"
                >
                  {application.job.title}
                </Link>
              </h3>
              <p className="text-gray-600">{application.job.company}</p>
              <div className="mt-1 text-sm text-gray-500">
                <span>{application.job.location}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{application.job.jobType}</span>
                {application.job.salary?.min && (
                  <>
                    <span className="mx-2">•</span>
                    <span>
                      {application.job.salary.currency} {application.job.salary.min.toLocaleString()}
                      {application.job.salary.max && ` - ${application.job.salary.max.toLocaleString()}`}
                    </span>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900">
                {application.applicant.name}
              </h3>
              <p className="text-gray-600">{application.applicant.email}</p>
            </>
          )}
        </div>
        <div className="flex items-center">
          <span 
            className={`px-3 py-1 rounded-full text-sm ${getStatusColor(application.status)}`}
          >
            {application.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="mt-4">
        <p className="text-gray-700 whitespace-pre-line">{application.coverLetter}</p>
      </div>

      {/* Footer */}
      {userRole === 'employer' && application.status === 'pending' && (
        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => handleStatusChange('rejected')}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mr-2"
          >
            Reject
          </button>
          <button 
            onClick={() => handleStatusChange('accepted')}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
