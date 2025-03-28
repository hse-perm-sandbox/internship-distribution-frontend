import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyService from '../services/companyService';
import ApplicationService from '../services/applicationService';
import StudentService from '../services/studentService';
import { ErrorAlert } from '../components/ErrorAlert';
import '../styles/Priority_making.css';

const ApplicationPriorities = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([null, null, null]);
  const [statuses, setStatuses] = useState(['NotSelected', 'NotSelected', 'NotSelected']);
  const [applicationId, setApplicationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const student = await StudentService.getMe();
        if (!student?.id) return navigate('/login');
        
        const companiesData = await CompanyService.getAll();
        setCompanies(companiesData);
        
        let application;
        try {
          application = await ApplicationService.getByStudentId(student.id);
        } catch (err) {
          application = null;
        }
        
        if (!application) {
          application = await ApplicationService.createApplication({
            studentId: student.id,
            priority1CompanyId: null,
            priority2CompanyId: null,
            priority3CompanyId: null
          });
        }
        
        setApplicationId(application.id);
        setSelectedCompanies([
          application.priority1CompanyId || null,
          application.priority2CompanyId || null,
          application.priority3CompanyId || null
        ]);
        setStatuses([
          application.priority1Status || 'NotSelected',
          application.priority2Status || 'NotSelected',
          application.priority3Status || 'NotSelected'
        ]);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        } else {
          setError(err.message || 'Произошла неизвестная ошибка');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleCompanySelect = (priorityIndex, companyId) => {
    setSelectedCompanies(prev => {
      const newSelected = [...prev];
      newSelected[priorityIndex] = companyId ? parseInt(companyId) : null;
      return newSelected;
    });
  };

  const handleSave = async () => {
    try {
      const dto = {
        priority1CompanyId: selectedCompanies[0],
        priority2CompanyId: selectedCompanies[1],
        priority3CompanyId: selectedCompanies[2]
      };
      await ApplicationService.updatePriorities(applicationId, dto);
      setError(null); // Сбрасываем ошибку при успешном сохранении
      alert('Приоритеты сохранены');

      const student = await StudentService.getMe();
      const updatedApp = await ApplicationService.getByStudentId(student.id);
      setStatuses([
        updatedApp.priority1Status || 'NotSelected',
        updatedApp.priority2Status || 'NotSelected',
        updatedApp.priority3Status || 'NotSelected'
      ]);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      } else {
        setError("Компании в приоритетах должны быть разными");
      }
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  // Убрали проверку на error здесь
  const statusMap = {
    "NotSelected": 'button--default',
    "Направлено": 'button--green',
    Rejected: 'button--red',
    InProgress: 'button--gray',
    Accepted: 'button--blue'
  };

  const priorityLabels = [1, 2, 3];

  return (
    <div className="priority-container">
      {/* Добавляем компонент ErrorAlert */}
      <ErrorAlert error={error} />
      
      <h2>Расставьте приоритеты компаниям</h2>
      {priorityLabels.map((priorityNumber, idx) => {
        const selectedCompanyId = selectedCompanies[idx];
        const companyStatus = statuses[idx];
        const buttonClass = statusMap[companyStatus] || 'button--default';

        return (
          <div className="company-row" key={priorityNumber}>
            <div className="company-priority-label">
              Приоритет {priorityNumber}
            </div>
            <select
            className="company-select"
            value={selectedCompanyId || ''}
            onChange={(e) => handleCompanySelect(idx, e.target.value)}
            >
            {!selectedCompanyId && <option value="">Выберите компанию</option>}
            
            {companies.map(c => (
                <option 
                key={c.id} 
                value={c.id}
                disabled={
                    selectedCompanies.includes(c.id) && 
                    selectedCompanies.indexOf(c.id) !== idx
                }
                >
                {c.name}
                </option>
            ))}
            </select>
            <button type="button" className={`status-button ${buttonClass}`} disabled>
              {companyStatus}
            </button>
          </div>
        );
      })}
      <div className="save-container">
        <button className="save-button" onClick={handleSave}>Сохранить</button>
      </div>
    </div>
  );
};

export default ApplicationPriorities;