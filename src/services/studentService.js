import api from "./api";

const STUDENT_URL = "/student";

const StudentService = {
  async getMe() {
    try {
      const response = await api.get(`${STUDENT_URL}/me`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async uploadResume(studentId, file) {
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await api.post(
        `${STUDENT_URL}/${studentId}/resume`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async downloadResume(studentId) {
    try {
      const response = await api.get(`${STUDENT_URL}/${studentId}/resume`, {
        responseType: 'blob', // Указываем, что ожидаем бинарные данные
      });

      // Возвращаем весь ответ, включая статус и заголовки
      return response;
    } catch (error) {
      // Если сервер вернул ошибку, пробрасываем её дальше
      throw new Error(error.response?.data?.Error || error.message);
    }
  },

  async deleteResume(studentId) {
    try {
      await api.delete(`${STUDENT_URL}/${studentId}/resume`);
    } catch (error) {
      throw error;
    }
  }
};

export default StudentService;