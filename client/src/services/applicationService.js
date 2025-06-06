import api from './authService';

export const applicationService = {
  async applyForJob(applicationData) {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  async getMyApplications() {
    const response = await api.get('/applications/my-applications');
    return response.data;
  },

  async getJobApplications(jobId) {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  async updateApplicationStatus(applicationId, status, notes) {
    const response = await api.put(`/applications/${applicationId}/status`, {
      status,
      notes
    });
    return response.data;
  },

  async withdrawApplication(applicationId) {
    const response = await api.delete(`/applications/${applicationId}`);
    return response.data;
  },

  async getApplicationById(applicationId) {
    const response = await api.get(`/applications/${applicationId}`);
    return response.data;
  }
};