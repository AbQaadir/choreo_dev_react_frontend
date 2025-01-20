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
        console.log(`Selected file: ${selectedFile.name}`);
        console.log(`File type: ${selectedFile.type}`);
        console.log(`File size: ${(selectedFile.size / 1024).toFixed(2)} KB`);
        setFile(selectedFile);
      } else {
        setErrorMessage('Please upload a valid PDF or image file (PNG/JPEG).');
        console.log('Invalid file type selected.');
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
      console.log('No file selected for upload.');
      return;
    }

    if (!selectedJobRole) {
      setErrorMessage('Please select a job role.');
      console.log('No job role selected.');
      return;
    }

    setIsLoading(true); // Show loading indicator
    console.log('Starting the file upload process...');
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          console.log('File successfully read as base64.');
          console.log('Sending file to the backend...');
          console.log(`Endpoint: ${serviceUrl}/smartDocInsightsAPI`);
          console.log(`File type: ${file.type}`);

          try {
            const response = await axios.post(
              `${serviceUrl}/smartDocInsightsAPI`,
              {
                file_type: file.type,
                base64_file: base64String,
              },
              {
                timeout: 180000, // Set timeout to 3 min
              }
            );
            console.log('Response from backend:');
            console.log(response.data);

            setSuccessMessage('File uploaded and processed successfully!');
            console.log('File processing completed successfully.');

            // Navigate to the DetailsPage and pass the JSON response and job role as state
            navigate('/details', { state: { ...response.data, jobRole: selectedJobRole } });
          } catch (error: any) {
            if (error.code === 'ECONNABORTED') {
              setErrorMessage('The request timed out. Please try again.');
              console.log('Error: Request timed out.');
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
      setIsLoading(false); // Hide loading indicator
      console.log('File upload process ended.');
    }
  };

  return (
    <div className="file-upload-container">
      <form className="upload-form" onSubmit={handleSubmit}>
        <h2>Upload your resume</h2>
        <div className="upload-input-wrapper">
          <input
            id="file-input"
            className="upload-input"
            type="file"
            accept="application/pdf, image/png, image/jpeg"
            onChange={handleFileChange}
          />
          <span>Drag & Drop your file here or</span>
          <label htmlFor="file-input" className="upload-label">
            Browse
          </label>
        </div>
        {file && <p className="file-name">{file.name}</p>}
        <div className="job-role-wrapper">
          <label htmlFor="job-role">Select Job Role:</label>
          <select
            id="job-role"
            className="job-role-select"
            value={selectedJobRole}
            onChange={handleJobRoleChange}
          >
            <option value="" disabled>Select a job role</option>
            {jobRoles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        {isLoading && (
          <div className="loading-overlay">
            <div className="loader"></div>
            <p className="loading-message">Processing your file...</p>
          </div>
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="submit-button" disabled={!file || !selectedJobRole || isLoading}>
          {isLoading ? 'Processing...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
