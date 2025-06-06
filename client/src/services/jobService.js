import api from './authService';

export const jobService = {
  async getAllJobs(params = {}) {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  async getJobById(id) {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  async createJob(jobData) {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  async updateJob(id, jobData) {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  async deleteJob(id) {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  async getMyJobs() {
    const response = await api.get('/jobs/employer/my-jobs');
    return response.data;
  }
};