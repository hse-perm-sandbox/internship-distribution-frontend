import axios from 'axios';

// Настройка базового URL вашего бэкенда
const api = axios.create({
  baseURL: 'https://localhost:44392/api', // Замените на ваш URL бэкенда
  headers: {
    'Content-Type': 'application/json'
  }
});

// Обработка ошибок
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.data.errors) {
      const validationErrors = Object.entries(error.response.data.errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ');
      return Promise.reject(new Error(validationErrors));
    }
    return Promise.reject(error);
  }
);

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