import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentService from '../services/studentService';
import { getUserRole } from '../services/authUtils';
import '../styles/Profile.css';
import { ErrorAlert } from '../components/ErrorAlert';

const Profile = () => {
  const [studentData, setStudentData] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = getUserRole();
    if (role !== 'Student') navigate('/');
    fetchStudentData();
  }, [navigate]);

  const fetchStudentData = async () => {
    try {
      const data = await StudentService.getMe();
      setStudentData(data);
    } catch (err) {
      setError('Ошибка загрузки данных');
    }
  };

  const handleUpload = async () => {
    if (!file || !studentData?.id) return;
    
    setLoading(true);
    try {
      await StudentService.uploadResume(studentData.id, file);
      await fetchStudentData(); // Обновляем данные после загрузки
      setError('');
    } catch (err) {
      setError(err.message || 'Ошибка загрузки файла');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await StudentService.downloadResume(studentData.id);
      
      // Декодируем имя файла из заголовка
      const contentDisposition = response.headers['content-disposition'];
      const fileName = decodeURIComponent(
        contentDisposition.split("filename*=UTF-8''")[1] || 
        `resume_${studentData.id}.pdf`
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Ошибка при скачивании');
    }
  };

  const handleDelete = async () => {
    if (!studentData?.resume || !window.confirm('Вы уверены что хотите удалить резюме?')) return;
    
    try {
      await StudentService.deleteResume(studentData.id);
      setStudentData(prev => ({ ...prev, resume: null }));
      setError('');
    } catch (err) {
      setError('Ошибка удаления файла');
    }
  };

  return (
    <div className="resume-container">
      {error && <ErrorAlert error={{ message: error }} />}
      <div className="resume-card">
        <h2>Управление резюме</h2>
        
        {/* Блок загрузки (всегда видимый) */}
        <div className="file-section">
          <label className="file-upload">
            <input 
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
            Выбрать PDF файл
          </label>
          {file && <span>{file.name}</span>}
        </div>

        <div className="controls">
          {/* Кнопка загрузки (всегда активна) */}
          <button 
            onClick={handleUpload}
            disabled={!file || loading}
            className="btn upload-btn"
          >
            {loading ? 'Загрузка...' : 'Загрузить'}
          </button>

          {/* Кнопки управления резюме */}
          {studentData?.isResumeUpload && (
            <>
              <button 
                onClick={handleDownload}
                className="btn download-btn"
              >
                Скачать резюме
              </button>
              <button 
                onClick={handleDelete}
                className="btn delete-btn"
              >
                Удалить резюме
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;