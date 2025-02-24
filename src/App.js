import React from "react";
import { Routes, Route } from "react-router-dom"; // НЕ импортируем <BrowserRouter> снова!
import Layout from "./components/Layout.js";
import Companies from "./pages/Companies.js";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Companies />} />
      </Routes>
    </Layout>
  );
}

export default App;
