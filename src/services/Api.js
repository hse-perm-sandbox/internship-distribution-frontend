import axios from "axios";
import AuthService from "./authService";

const api = axios.create({
  baseURL: "https://localhost:44392/api", // Укажи правильный URL
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
    // Для multipart запросов
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
  }
  return config;
});

// Добавляем токен в заголовки перед каждым запросом
api.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обрабатываем ошибки в ответах
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data.errors) {
      const validationErrors = Object.entries(error.response.data.errors)
        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
        .join("; ");
      return Promise.reject(new Error(validationErrors));
    }
    return Promise.reject(error);
  }
);

export default api;
