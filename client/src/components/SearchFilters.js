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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="search"
        placeholder="Search by title or description"
        value={filters.search}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={filters.location}
        onChange={handleInputChange}
      />
      <select name="jobType" value={filters.jobType} onChange={handleInputChange}>
        <option value="">All job types</option>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="contract">Contract</option>
        <option value="internship">Internship</option>
      </select>
      <input
        type="text"
        name="skills"
        placeholder="Skills"
        value={filters.skills}
        onChange={handleInputChange}
      />
      <button type="submit" disabled={loading}>Search</button>
      <button type="button" onClick={handleReset} disabled={loading}>Reset</button>
    </form>
  );
};

export default SearchFilters;