// pages/ResumeEditPage.jsx
import React, { useState, useEffect } from "react";
import StudentService from "../services/studentService";
import { getUserRole } from "../services/authUtils";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import ResumeUploader from "../components/ResumeUploader";
import { ErrorAlert } from '../components/ErrorAlert';


function Profile() {
  const [studentData, setStudentData] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = getUserRole();
    if (role !== "Student") {
      navigate("/");
    } else {
      fetchStudentData();
    }
  }, [navigate]);

  const fetchStudentData = async () => {
    try {
      const data = await StudentService.getMe();
      setStudentData(data);
    } catch (err) {
      setError({ message: 'Ошибка загрузки данных' }); // <-- Исправлено
    }
  };

  const handleUpload = async () => {
    if (!file || !studentData?.id) return;
    setLoading(true);
    try {
      await StudentService.uploadResume(studentData.id, file);
      await fetchStudentData(); // Обновляем данные (resumeFileName станет не null)
      setError("");
      setFile(null);
    } catch (err) {
      setError({ message: err.message || 'Ошибка загрузки файла' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await StudentService.downloadResume(studentData.id);
      const contentDisposition = response.headers["content-disposition"];
      const fileName = decodeURIComponent(
        contentDisposition.split("filename*=UTF-8''")[1] ||
          `resume_${studentData.id}.pdf`
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError({ message: err.message || 'Ошибка при скачивании' });
    }
  };

  const handleDelete = async () => {
    if (!studentData?.resumeFileName) return;
    if (!window.confirm("Вы уверены что хотите удалить резюме?")) return;
    try {
      await StudentService.deleteResume(studentData.id);
      setStudentData((prev) => ({ ...prev, resumeFileName: null }));
      setError("");
    } catch (err) {
      setError({ message: 'Ошибка удаления файла' });    
    }
  };

  return (
    <div className="resume-edit-container">
      <h1>Редактирование резюме</h1>
      {error && <ErrorAlert error={error} />}
      {studentData?.resumeFileName ? (
  <>
    {/* Отображаем ResumeUploader с уже загруженным файлом */}
    <ResumeUploader 
      onFileSelect={(selectedFile) => setFile(selectedFile)} 
      uploadedFileName={studentData.resumeFileName} // Передаем название загруженного файла
    />
    <div className="resume-actions">
      <button onClick={handleDownload} className="action-btn">
        Скачать
      </button>
      <button onClick={handleDelete} className="action-btn delete-btn">
        Удалить
      </button>
    </div>
  </>
) : (
  <>
    {/* Отображаем ResumeUploader для выбора нового файла */}
    <ResumeUploader onFileSelect={(selectedFile) => setFile(selectedFile)} />
    <button
      onClick={handleUpload}
      disabled={!file || loading}
      className="upload-button"
    >
      {loading ? "Загрузка..." : "Загрузить"}
    </button>
  </>
)}
    </div>
  );
}

export default Profile;
