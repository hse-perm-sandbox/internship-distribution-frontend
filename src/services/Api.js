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
    let errorMessage = 'Произошла неизвестная ошибка';
    
    if (error.response) {
      // Обработка валидационных ошибок ASP.NET
      if (error.response.data.errors) {
        errorMessage = Object.values(error.response.data.errors)
          .flat()
          .join(', ');
      }
      // Обработка кастомных ошибок из body
      else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      // Стандартные HTTP ошибки
      else {
        errorMessage = error.response.statusText;
      }
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
