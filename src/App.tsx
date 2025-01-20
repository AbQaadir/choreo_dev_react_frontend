import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import FileUpload from './components/FileUpload';
import DetailsPage from './components/DetailsPage';
import AssignmentPage from './components/AssignmentPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/details" element={<DetailsPage />} />
        <Route path="/assignment" element={<AssignmentPage />} />
      </Routes>
    </Router>
  );
};

export default App;