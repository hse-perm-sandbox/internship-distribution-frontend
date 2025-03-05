// pages/Menu.js
import React from "react";
import { Navigate, Link } from "react-router-dom";
import { getUserRole } from "../services/authUtils";
import "../styles/Menu.css";

export default function Menu() {
  const role = getUserRole();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="menu-container">
      <section className="buttons-container">
        <Link className="button" to="/companies">Компании</Link>
        
        {role === "Student" ? (
          <>
            <Link className="button" to="/profile">Информация о себе</Link>
            <Link className="button" to="/priorities">Расставить приоритеты</Link>
            <Link className="button" to="/results">Результаты распределения</Link>
          </>
        ) : role === "Manager" ? (
          <>
            <Link className="button" to="/students">Список студентов</Link>
            <Link className="button" to="/management">Управление УЗ</Link>
            <Link className="button" to="/results">Результаты распределения</Link>
          </>
        ) : null}

        <button 
          className="button"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Выйти
        </button>
      </section>
    </div>
  );
}