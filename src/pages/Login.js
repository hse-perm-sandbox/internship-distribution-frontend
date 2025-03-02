import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import AuthService from "../services/authService"; // Убедись, что путь правильный

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting login form with:", email, password);
      const response = await AuthService.login(email, password); // ✅ Исправленный вызов

      if (response.token) {
        console.log("Login successful, token:", response.token);
        navigate("/companies"); // Перенаправляем пользователя
      }
    } catch (error) {
      console.error("Ошибка входа", error);
      alert("Ошибка входа. Проверьте логин и пароль.");
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h3 className="form__title">
          Добро пожаловать на платформу по подбору компании для практики
        </h3>
        <div className="form__input">
          <input
            className="form_input-text"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Логин"
            required
          />
        </div>
        <div className="form__input">
          <input
            className="form_input-text"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            required
          />
        </div>
        <div className="form__input">
          <button className="button button--margin" type="submit">
            Войти
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
