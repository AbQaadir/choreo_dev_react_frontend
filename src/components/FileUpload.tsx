import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FileUpload.css';
import { serviceUrl } from '../config';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedJobRole, setSelectedJobRole] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const jobRoles = [
    'Software Engineer',
    'Senior Software Engineer',
    'Intern Software Engineer',
    'DevOps Engineer',
    'Data Scientist',
    'Product Manager',
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const validFileTypes = ['application/pdf', 'image/png', 'image/jpeg'];

      if (validFileTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        setErrorMessage('Please upload a valid PDF or image file (PNG/JPEG).');
        setFile(null);
      }
    }
  };

  const handleJobRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedJobRole(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      setErrorMessage('No file selected.');
      return;
    }

    if (!selectedJobRole) {
      setErrorMessage('Please select a job role.');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {

          try {
            setIsLoading(true);
            const response = await axios.post(
              `${serviceUrl}/smartDocInsightsAPI`,
              {
                file_type: file.type,
                base64_file: base64String,
              },
              {
                timeout: 180000, // 3 min timeout
              }
            );

            setSuccessMessage('File uploaded and processed successfully!');

            navigate('/details', { state: { ...response.data, jobRole: selectedJobRole } });
          } catch (error: any) {
            if (error.code === 'ECONNABORTED') {
              setErrorMessage('The request timed out. Please try again.');
            } else {
              setErrorMessage('An error occurred while processing the file.');
              console.error('Error processing file:', error);
            }
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <form onSubmit={handleSubmit}>
        <h2>Upload Resume</h2>
        <div className="upload-input-wrapper">
          <input
            id="file-input"
            type="file"
            accept="application/pdf, image/png, image/jpeg"
            onChange={handleFileChange}
          />
          <span>Drop file or</span>
          <label htmlFor="file-input" className="upload-label">
            Browse
          </label>
        </div>
        {file && <p className="file-name">{file.name}</p>}
        <div className="job-role-wrapper">
          <label htmlFor="job-role">Job Role:</label>
          <select
            id="job-role"
            className="job-role-select"
            value={selectedJobRole}
            onChange={handleJobRoleChange}
          >
            <option value="" disabled>
              Select
            </option>
            {jobRoles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        {isLoading && (
          <div className="loading-overlay">
            <div className="loader" />
            <p className="loading-message">Processing...</p>
          </div>
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button
          type="submit"
          className="submit-button"
          disabled={!file || !selectedJobRole || isLoading}
        >
          {isLoading ? 'Processing' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
