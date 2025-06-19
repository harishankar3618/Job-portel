import React from 'react';
import { Link } from 'react-router-dom';

const ApplicationCard = ({ application, userRole = 'candidate', onStatusChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'badge badge-secondary';
      case 'reviewed':
        return 'badge' + ' ' + 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'badge badge-primary';
      case 'rejected':
        return 'badge' + ' ' + 'bg-red-100 text-red-800';
      default:
        return 'badge badge-secondary';
    }
  };

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(application._id, newStatus);
    }
  };

  return (
    <div className="glass-card p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {userRole === 'candidate' ? (
            <>
              <h3 className="text-lg font-semibold text-white mb-2">
                <Link
                  to={`/job/${application.job._id}`}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {application.job.title}
                </Link>
              </h3>
              <p className="text-gray-300 mb-2">{application.job.company}</p>
              <div className="mt-1 text-sm text-gray-400">
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
              <h3 className="text-lg font-semibold text-white mb-2">
                {application.applicant.name}
              </h3>
              <p className="text-gray-300">{application.applicant.email}</p>
            </>
          )}
        </div>
        <div className="flex items-center">
          <span className={getStatusColor(application.status)}>
            {application.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="mt-4">
        <p className="text-gray-200 whitespace-pre-line">{application.coverLetter}</p>
      </div>

      {/* Footer */}
      {userRole === 'employer' && application.status === 'pending' && (
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => handleStatusChange('rejected')}
            className="btn-danger"
          >
            Reject
          </button>
          <button
            onClick={() => handleStatusChange('accepted')}
            className="btn-primary"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
