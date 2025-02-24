import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/hse-logo.jpg"; // Убедись, что у тебя есть логотип в папке assets

function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/">
          <img className="logo" src={logo} alt="HSE Logo" />
        </Link>
      </div>
    </header>
  );
}

export default Header;