import api from "./api";

const AUTH_URL = "/auth"; // Проверь, что этот путь совпадает с бэкендом

const AuthService = {
  async login(email, password) {
    console.log("AuthService.login called with:", { email, password });

    try {
      const response = await api.post(`${AUTH_URL}/login`, { email, password });

      console.log("Login response:", response.data);

      // Сохраняем токен в localStorage
      localStorage.setItem("token", response.data.token);

      return response.data;
    } catch (error) {
      console.error("Ошибка при входе:", error.response?.data || error.message);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("token");
  },

  getToken() {
    return localStorage.getItem("token");
  }
};

// Проверяем, загружается ли сервис
console.log("AuthService loaded:", AuthService);

export default AuthService;
