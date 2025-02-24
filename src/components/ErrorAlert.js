import { useEffect, useState } from 'react';
import '../styles/ErrorAlert.css';

export const ErrorAlert = ({ error }) => {
  const [isVisible, setIsVisible] = useState(!!error);

  useEffect(() => {
    setIsVisible(!!error);
    if (error) {
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!isVisible) return null;

  return (
    <div className="error-alert">
      <span>Ошибка: {error.message}</span>
    </div>
  );
};