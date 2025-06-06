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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            <Link 
              to={`/jobs/${job._id}`}
              className="hover:text-primary-600 transition-colors"
            >
              {job.title}
            </Link>
          </h3>
          <p className="text-gray-600 mb-2">{job.company}</p>
          <p className="text-gray-500 text-sm">{job.location}</p>
        </div>
        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            job.jobType === 'full-time' ? 'bg-green-100 text-green-800' :
            job.jobType === 'part-time' ? 'bg-blue-100 text-blue-800' :
            job.jobType === 'contract' ? 'bg-yellow-100 text-yellow-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {job.jobType}
          </span>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {job.description}
      </p>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-900 mb-2">Required Skills:</p>
        <div className="flex flex-wrap gap-2">
          {job.skills?.slice(0, 4).map((skill, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {skill}
            </span>
          ))}
          {job.skills?.length > 4 && (
            <span className="text-xs text-gray-500">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {formatSalary(job.salary)}
          </p>
          <p className="text-xs text-gray-500">
            Posted {formatDate(job.createdAt)}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {job.applicationsCount || 0} applicants
          </span>
          <Link
            to={`/jobs/${job._id}`}
            className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;