import React, { useState } from 'react';

const JobForm = ({ initialData = {}, onSubmit, loading = false, submitText = 'Submit' }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    requirements: initialData.requirements || '',
    location: initialData.location || '',
    jobType: initialData.jobType || 'full-time',
    company: initialData.company || '',
    skills: initialData.skills?.join(', ') || '',
    salaryMin: initialData.salary?.min || '',
    salaryMax: initialData.salary?.max || '',
    salaryCurrency: initialData.salary?.currency || 'USD',
    applicationDeadline: initialData.applicationDeadline
      ? new Date(initialData.applicationDeadline).toISOString().split('T')[0]
      : ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const jobData = {
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      jobType: formData.jobType,
      company: formData.company,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
      applicationDeadline: formData.applicationDeadline || null
    };

    // Add salary if provided
    if (formData.salaryMin || formData.salaryMax) {
      jobData.salary = {
        currency: formData.salaryCurrency
      };

      if (formData.salaryMin) {
        jobData.salary.min = Number(formData.salaryMin);
      }

      if (formData.salaryMax) {
        jobData.salary.max = Number(formData.salaryMax);
      }
    }

    onSubmit(jobData);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Title */}
        <div className="form-group">
          <label className="form-label">
            Job Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="glass-input"
            required
          />
        </div>

        {/* Company */}
        <div className="form-group">
          <label className="form-label">
            Company *
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="glass-input"
            required
          />
        </div>

        {/* Location and Job Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="glass-input"
              placeholder="e.g., New York, NY or Remote"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Job Type *
            </label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="glass-select"
              required
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>

        {/* Salary Range */}
        <div className="form-group">
          <label className="form-label">
            Salary Range (Optional)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                className="glass-input"
                placeholder="Minimum"
              />
            </div>
            <div>
              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                className="glass-input"
                placeholder="Maximum"
              />
            </div>
            <div>
              <select
                name="salaryCurrency"
                value={formData.salaryCurrency}
                onChange={handleChange}
                className="glass-select"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="form-group">
          <label className="form-label">
            Required Skills
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="glass-input"
            placeholder="e.g., JavaScript, React, Node.js (comma-separated)"
          />
        </div>

        {/* Application Deadline */}
        <div className="form-group">
          <label className="form-label">
            Application Deadline (Optional)
          </label>
          <input
            type="date"
            name="applicationDeadline"
            value={formData.applicationDeadline}
            onChange={handleChange}
            className="glass-input"
          />
        </div>

        {/* Job Description */}
        <div className="form-group">
          <label className="form-label">
            Job Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className="glass-input"
            placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
            required
          />
        </div>

        {/* Requirements */}
        <div className="form-group">
          <label className="form-label">
            Requirements *
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows={6}
            className="glass-input"
            placeholder="List the qualifications, experience, and skills required for this position..."
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : submitText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
