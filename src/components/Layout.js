import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/Layout.css"; // Подключаем стили

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
