import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FileUpload.css';
import { serviceUrl } from '../config';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      setErrorMessage('No file selected.');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          console.log('Sending base64-encoded file and type to the backend...');
          console.log(serviceUrl)
          const response = await axios.post(`${serviceUrl}/smartDocInsightsAPI`, {
            file_type: file.type,
            base64_file: base64String,
          });
          console.log('File processed successfully:', response.data);
          setSuccessMessage('File uploaded and processed successfully!');

          // Navigate to the DetailsPage and pass the JSON response as state
          navigate('/details', { state: response.data });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing file:', error);
      setErrorMessage('An error occurred while processing the file.');
    }
  };

  return (
    <div className="file-upload-container">
      <form className="upload-form" onSubmit={handleSubmit}>
        <h2>Upload Your Resume</h2>
        <input
          id="file-input"
          className="upload-input"
          type="file"
          accept="application/pdf, image/png, image/jpeg"
          onChange={handleFileChange}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="submit-button" disabled={!file}>
          Upload
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
