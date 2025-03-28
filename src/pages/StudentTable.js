import React, { useEffect, useState } from 'react';
import StudentService from '../services/studentService';
import CompanyService from '../services/companyService';
import '../styles/StudentTable.css';

const ManagerStudentTable = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentsWithApps, allCompanies] = await Promise.all([
          StudentService.getAllStudentsWithApplications(),
          CompanyService.getAll(),
        ]);

        const processedData = studentsWithApps.map(student => ({
          id: student.id,
          fullName: `${student.lastname} ${student.name} ${student.fathername || ''}`.trim(),
          priorities: {
            1: allCompanies.find(c => c.id === student.priority1CompanyId)?.name || null,
            2: allCompanies.find(c => c.id === student.priority2CompanyId)?.name || null,
            3: allCompanies.find(c => c.id === student.priority3CompanyId)?.name || null
          },
          resume: student.resumeFileName
        }));

        setStudentsData(processedData);
        setCompanies(allCompanies);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getActivePriority = (student) => {
    if (selectedPriority === 'all') {
      return Object.entries(student.priorities).find(([_, company]) => company)?.[0] || 'none';
    }
    return selectedPriority;
  };

  const filteredStudents = studentsData.filter(student => {
    const activePriority = getActivePriority(student);
    const activeCompany = student.priorities[activePriority] || null;

    // Фильтрация по компании
    if (selectedCompany !== 'all' && activeCompany !== selectedCompany) return false;

    // Фильтрация по приоритету
    if (selectedPriority !== 'all' && !student.priorities[selectedPriority]) return false;

    return true;
  });

  const handleDownloadResume = async (studentId) => {
    try {
      const response = await StudentService.downloadResume(studentId);
  
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `resume_${studentId}.pdf`; // имя файла по умолчанию
  
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = decodeURIComponent(fileNameMatch[1]);
        }
      }
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
  
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Ошибка при скачивании резюме: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="container">
      <section className="student-table">
        <h1 className="student-table__title">Студенты программы</h1>
        
        <div className="filters-container">
          <div className="filter-group">
            <label>Приоритет:</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="all">Все</option>
              <option value="1">Приоритет 1</option>
              <option value="2">Приоритет 2</option>
              <option value="3">Приоритет 3</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Компания:</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="all">Все</option>
              {companies.map(company => (
                <option key={company.id} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="student-table__container">
          <div className="student-table__header">ФИО студента</div>
          <div className="student-table__header">Приоритет</div>
          <div className="student-table__header">Компания</div>
          <div className="student-table__header">Резюме</div>

          {filteredStudents.map(student => {
            const activePriority = getActivePriority(student);
            const company = student.priorities[activePriority] || 'Не выбрана';

            return (
              <React.Fragment key={student.id}>
                <div className="student-table__item">{student.fullName}</div>
                <div className="student-table__item">
                  {activePriority === 'none' ? 'Не выбрано' : `Приоритет ${activePriority}`}
                </div>
                <div className="student-table__item">{company}</div>
                <div className="student-table__item">
                  {student.resume ? (
                    <button 
                      className="btn-download"
                      onClick={() => handleDownloadResume(student.id)}
                    >
                      Скачать
                    </button>
                  ) : (
                    'Нет резюме'
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ManagerStudentTable;
