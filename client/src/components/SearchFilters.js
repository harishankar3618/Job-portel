import React, { useState } from 'react';

const SearchFilters = ({ onSearch, loading }) => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    skills: ''
  });

  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      location: '',
      jobType: '',
      skills: ''
    });
    onSearch({});
  };

  return (
    <div className="glass-card p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="form-group">
            <input
              type="text"
              name="search"
              placeholder="Search by title or description"
              value={filters.search}
              onChange={handleInputChange}
              className="glass-input"
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleInputChange}
              className="glass-input"
            />
          </div>
          
          <div className="form-group">
            <select 
              name="jobType" 
              value={filters.jobType} 
              onChange={handleInputChange}
              className="glass-select"
            >
              <option value="">All job types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="skills"
              placeholder="Skills"
              value={filters.skills}
              onChange={handleInputChange}
              className="glass-input"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-4">
          <button 
            type="button" 
            onClick={handleReset} 
            disabled={loading}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;
