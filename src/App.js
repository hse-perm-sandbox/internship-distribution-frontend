import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.js";
import Companies from "./pages/Companies.js";
import Login from "./pages/Login";
import Menu from "./pages/Menu";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/menu" element={<Layout><Menu /></Layout>} />
      <Route path="/companies" element={<Layout><Companies /></Layout>} />
    </Routes>
  );
}

export default App;
