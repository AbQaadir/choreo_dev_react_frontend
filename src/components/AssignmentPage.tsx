import React from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './AssignmentPage.css';

const AssignmentPage: React.FC = () => {
    const location = useLocation();
    const { state } = location;
    const responseData = state?.responseData || '';

    return (
        <div className="assignment-page-container">
            <h1>Assignment</h1>
            <div className="markdown-container">
                <ReactMarkdown>{responseData}</ReactMarkdown>
            </div>
        </div>
    );
};

export default AssignmentPage;
