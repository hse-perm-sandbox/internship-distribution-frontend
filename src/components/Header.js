import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/hse-logo.jpg";
import userIcon from "../assets/user_icon.svg";
import exitIcon from "../assets/exit_icon.svg";
import AuthService from "../services/authService";
import "../styles/Header.css";

function Header() {
  const navigate = useNavigate();
  const userInfo = AuthService.getUserInfo();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <header className="header">
      {/* Левая часть: Логотип + блок с данными пользователя */}
      <div className="hse_logo">
        <Link to="/menu">
          <img className="logo" src={logo} alt="HSE Logo" />
        </Link>
        </div>

        <div className="user_info">
        {userInfo && (
          <div className="header__user-info">
            <img src={userIcon} alt="User icon" className="icon user-icon" />
            <div className="user-text">
              <span className="user-role">{userInfo.role}</span>
              <span className="user-email">{userInfo.email}</span>
            </div>
          </div>
        )}
      </div>

      {/* Справа: кнопка выхода */}
      <button onClick={handleLogout} className="logout-button">
        <img src={exitIcon} alt="Exit icon" className="icon" />
      </button>
    </header>
  );
}

export default Header;
