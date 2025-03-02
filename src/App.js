import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.js";
import Companies from "./pages/Companies.js";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/companies"
        element={
          <Layout>
            <Companies />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
