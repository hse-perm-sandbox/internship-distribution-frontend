import React from 'react';
import { useNavigate } from 'react-router-dom';
import FourOhFour from '../assets/404_error.svg'; 
import '../styles/NotFound.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        {/* Изображение с «404» */}
        <img src={FourOhFour} alt="404" className="notfound-404" />
        <button onClick={handleGoBack} className="notfound-button">
          Вернуться назад
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
