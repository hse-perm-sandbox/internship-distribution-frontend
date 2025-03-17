import React, { useState, useRef } from 'react';
import '../styles/ResumeUploader.css';
import { ReactComponent as UploadIcon } from '../assets/upload-cloud.svg';
import pdfLogo from '../assets/pdf_logo.svg';

const ResumeUploader = ({ onFileSelect, uploadedFileName }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const inputRef = useRef(null);

  // Если есть uploadedFileName, файл уже загружен
  const isUploaded = !!uploadedFileName;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    if (!isUploaded) {
      inputRef.current.click();
    }
  };

  const processFile = (file) => {
    if (file && file.type === 'application/pdf') {
      setFileSelected(true);
      setSelectedFileName(file.name);
      onFileSelect(file);
    } else {
      alert('Пожалуйста, выберите PDF файл');
    }
  };

  return (
    <div
      className={`drop-zone ${dragActive ? 'active' : ''}`}
      onClick={handleClick}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      {/* Если файл уже загружен, показываем его название и иконку */}
      {isUploaded ? (
        <div className="selected-file">
          <img src={pdfLogo} alt="PDF logo" className="pdf-logo" />
          <p className="file-name">{uploadedFileName}</p>
        </div>
      ) : fileSelected ? (
        <div className="selected-file">
          <img src={pdfLogo} alt="PDF logo" className="pdf-logo" />
          <p className="file-name">{selectedFileName}</p>
        </div>
      ) : (
        <>
          <UploadIcon className="upload-icon" />
          <p>Перетащите файл сюда или нажмите, чтобы выбрать (.pdf)</p>
        </>
      )}

      {/* Скрытое поле для выбора файла */}
      {!isUploaded && (
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              processFile(e.target.files[0]);
            }
          }}
          hidden
        />
      )}
    </div>
  );
};

export default ResumeUploader;