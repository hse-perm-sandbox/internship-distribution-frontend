import api from "./api";

const CompanyService = {
  async getAll() {
    const response = await api.get("/companies");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  async create(companyDto) {
    const response = await api.post("/companies", companyDto);
    return response.data;
  },

  async update(id, companyDto) {
    await api.put(`/companies/${id}`, companyDto);
  },

  async delete(id) {
    await api.delete(`/companies/${id}`);
  }
};

export default CompanyService;
