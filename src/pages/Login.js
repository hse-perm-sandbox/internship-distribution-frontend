import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import AuthService from "../services/authService";
import { ErrorAlert } from '../components/ErrorAlert';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await AuthService.login(email, password);
      if (response.token) {
        navigate("/menu");
      }
    } catch (error) {
      console.error("Ошибка входа", error);
      
      // Формируем сообщение об ошибке
      const errorMessage = error.response?.data?.message 
        || "Неверный логин или пароль";
      
      setError({ message: errorMessage }); // Устанавливаем ошибку
    }
  };

  return (
    <div className="login-page"> {/* Добавлен контейнер для страницы входа */}
    {error && <ErrorAlert error={error} />}
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
    </div>
  );
}

export default Login;