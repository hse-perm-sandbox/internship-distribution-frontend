import { useEffect, useState, useMemo } from 'react';
import '../styles/ErrorAlert.css';

export const ErrorAlert = ({ error }) => {
  // Мемоизируем преобразование ошибки
  const errorObj = useMemo(() => 
    typeof error === 'string' ? { message: error } : error,
  [error]); // Добавляем зависимость

  const [isVisible, setIsVisible] = useState(!!errorObj);

  useEffect(() => {
    setIsVisible(!!errorObj);
    if (errorObj) {
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorObj]); // Теперь зависимость стабильна

  if (!isVisible || !errorObj) return null;

  return (
    <div className="error-alert">
      <span>Ошибка: {errorObj.message}</span>
    </div>
  );
};