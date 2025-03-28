import api from "./api";

const ApplicationService = {
  async createApplication(dto) {
    const response = await api.post('/applications', dto);
    return response.data;
  },

  async getApplication(id) {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  async getAllApplications() {
    const response = await api.get('/applications');
    return response.data;
  },

  async updatePriorities(id, dto) {
    const response = await api.patch(`/applications/${id}/priorities`, dto);
    return response.data;
  },

  async deleteApplication(id) {
    await api.delete(`/applications/${id}`);
  },

  async getByStudentId(studentId) {
    const response = await api.get(`/applications/by-student/${studentId}`);
    return response.data;
  }
};

export default ApplicationService;
