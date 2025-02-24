import axios from 'axios';

// Настройка базового URL вашего бэкенда
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Замените на ваш URL бэкенда
  headers: {
    'Content-Type': 'application/json'
  }
});

// Сервис для работы с компаниями
export const CompanyService = {
  async getAll() {
    const response = await api.get('/companies');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  async create(companyDto) {
    const response = await api.post('/companies', companyDto);
    return response.data;
  },

  async update(id, companyDto) {
    await api.put(`/companies/${id}`, companyDto);
  },

  async delete(id) {
    await api.delete(`/companies/${id}`);
  }
};