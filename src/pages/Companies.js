import React, { useState, useEffect } from "react";
import { CompanyService } from "../services/Api";
import "../styles/Companies.css";
import { ErrorAlert } from '../components/ErrorAlert';


function Companies() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [error, setError] = useState(null); // Добавлено состояние ошибки

  // Загрузка компаний
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await CompanyService.getAll();
        setCompanies(data);
      } catch (err) {
        setError(err); // Устанавливаем ошибку
      }
    };
    loadCompanies();
  }, []);

  // Обработчик выбора компании
  const handleSelectCompany = async (id) => {
    try {
      const company = await CompanyService.getById(id);
      setSelectedCompany(company);
      setFormData({
        name: company.name,
        description: company.description
      });
      setEditMode(false);
    } catch (err) {
      setError(err); // Устанавливаем ошибку
    }
  };

  // Обработчик сохранения изменений
  const handleSave = async () => {
    try {
      if (selectedCompany) { // Режим редактирования
        await CompanyService.update(selectedCompany.id, formData);
        const updatedCompanies = companies.map(c => 
          c.id === selectedCompany.id ? { ...c, ...formData } : c
        );
        setCompanies(updatedCompanies);
        setEditMode(false);
      } else { // Режим создания новой компании
        const newCompany = await CompanyService.create(formData);
        setCompanies([...companies, newCompany]);
        setEditMode(false);
        setSelectedCompany(newCompany); // Устанавливаем новую компанию как выбранную
      }
    } catch (err) {
      setError(err);
    }
  };

  // Обработчик удаления
  const handleDelete = async () => {
    try {
      await CompanyService.delete(selectedCompany.id);
      setCompanies(companies.filter(c => c.id !== selectedCompany.id));
      setSelectedCompany(null);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="container">
          {error && <ErrorAlert error={error} />}
      <section className="content">
        <aside className="sidebar">
          <h3>Список доступных компаний</h3>
          {companies.map((company) => (
            <button
              key={company.id}
              className={`company-btn ${selectedCompany?.id === company.id ? "active" : ""}`}
              onClick={() => handleSelectCompany(company.id)}
            >
              {company.name}
            </button>
          ))}
          <button 
            className="button-add"
            onClick={() => {
              setSelectedCompany(null);
              setFormData({ name: "", description: "" });
              setEditMode(true);
            }}
          >
            Добавить компанию
          </button>
        </aside>

        <main className="company-details">
          {editMode || selectedCompany ? (
            <div>
              <h3>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  readOnly={!editMode && !!selectedCompany}
                />
              </h3>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                readOnly={!editMode}
              />
                <div className="buttons">
                  {editMode ? (
                    // Режим редактирования - показываем кнопку "Сохранить"
                    <button className="button-save" onClick={handleSave}>
                      Сохранить
                    </button>
                  ) : (
                    // Режим просмотра - показываем кнопку "Изменить"
                    selectedCompany && (
                      <button 
                        className="button-save" 
                        onClick={() => setEditMode(true)} // Активируем режим редактирования
                      >
                        Изменить
                      </button>
                    )
                  )}
                  {selectedCompany && (
                    <button className="button-delete" onClick={handleDelete}>
                      Удалить
                    </button>
                  )}
                </div>
            </div>
          ) : (
            <p>Выберите компанию для просмотра информации.</p>
          )}
        </main>
      </section>
    </div>
  );
}

export default Companies;