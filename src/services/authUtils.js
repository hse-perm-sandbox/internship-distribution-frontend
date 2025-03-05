export function getUserRole() {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Декодируем payload
      const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      return payload[roleKey] || null; // Возвращаем роль (если есть)
    } catch (error) {
      console.error("Ошибка при разборе токена:", error);
      return null;
    }
  }
  