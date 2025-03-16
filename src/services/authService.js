import api from "./api";
import { jwtDecode } from "jwt-decode"; // <-- исправленный импорт

const AUTH_URL = "/auth";

const AuthService = {
  async login(email, password) {
    try {
      const response = await api.post(`${AUTH_URL}/login`, { email, password });
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
  },

  getUserInfo() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return {
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
        userId: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
      };
      
    } catch (e) {
      console.error("Ошибка декодирования JWT:", e);
      return null;
    }
  }
};

export default AuthService;