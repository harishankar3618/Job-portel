import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getJobTypeBadge = (jobType) => {
    switch (jobType) {
      case 'full-time':
        return 'badge badge-primary';
      case 'part-time':
        return 'badge' + ' ' + 'bg-blue-100 text-blue-800 backdrop-filter blur-10';
      case 'contract':
        return 'badge badge-secondary';
      default:
        return 'badge badge-secondary';
    }
  };

  return (
    <div className="job-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            <Link
              to={`/jobs/${job._id}`}
              className="hover:text-cyan-400 transition-colors"
            >
              {job.title}
            </Link>
          </h3>
          <p className="text-gray-300 mb-2">{job.company}</p>
          <p className="text-gray-400 text-sm">{job.location}</p>
        </div>
        <div className="text-right">
          <span className={getJobTypeBadge(job.jobType)}>
            {job.jobType}
          </span>
        </div>
      </div>

      <p className="text-gray-200 mb-4 line-clamp-3">
        {job.description}
      </p>

      <div className="mb-4">
        <p className="text-sm font-medium text-cyan-400 mb-2">Required Skills:</p>
        <div className="flex flex-wrap gap-2">
          {job.skills?.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white bg-opacity-10 text-gray-200 text-xs rounded-full backdrop-filter backdrop-blur-10"
            >
              {skill}
            </span>
          ))}
          {job.skills?.length > 4 && (
            <span className="text-xs text-gray-400">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-white border-opacity-10">
        <div>
          <p className="text-sm font-medium text-white">
            {formatSalary(job.salary)}
          </p>
          <p className="text-xs text-gray-400">
            Posted {formatDate(job.createdAt)}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">
            {job.applicationsCount || 0} applicants
          </span>
          <Link
            to={`/jobs/${job._id}`}
            className="btn-primary"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
