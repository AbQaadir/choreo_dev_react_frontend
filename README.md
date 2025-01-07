# Resume Upload Application

This project includes:  
1. A **React Web UI** for uploading resumes.  
2. A **Ballerina Backend** to handle the uploaded resumes and extract data from them.

---

## Features

### Frontend (React Web UI)
- Simple and user-friendly interface for uploading resumes.
- Supports uploading PDF files.

### Backend (Ballerina Backend)
- **Resume Data Extractor**:  
  - Uploads a resume in PDF format.
  - Converts each page of the PDF into an image.
  - Processes the image to extract data.
  - Generates a JSON representation of the extracted data.
  - Sends the JSON back to the front end for display.

---

## Requirements

- **Frontend**:
  - Node.js and npm
- **Backend**:
  - Ballerina runtime environment

---

## Installation and Setup

### Frontend
1. Navigate to the `frontend/` directory:  
   ```bash
   cd frontend
   ```
2. Install dependencies:  
   ```bash
   yarn install
   ```
3. Start the React development server:  
   ```bash
   yarn start
   ```
   The UI will be accessible at `http://localhost:3000`.

### Backend
1. Navigate to the `backend/` directory:  
   ```bash
   cd backend
   ```
2. Run the Ballerina service:  
   ```bash
   bal run
   ```
   The backend will be accessible at `http://localhost:8080`.

---

## Usage
1. Open the React Web UI in your browser.
2. Upload a resume (PDF format) through the UI.
3. The backend will:
   - Convert each page of the PDF into an image.
   - Process the images to extract relevant data.
   - Generate a JSON response from the extracted data.
   - Send the JSON back to the front end for display.

---
"# choreo_dev_react_frontend" 
