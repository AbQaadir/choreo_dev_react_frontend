import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DetailsPage.css';

interface ResumeDetails {
    personal_info: {
        full_name: string;
        email: string;
        phone: string;
        address: string;
        country: string;
    };
    education: Array<{
        qualification: string;
        institution: string;
        location: string;
        gpa: string;
        year: number;
    }>;
    experience: Array<{
        company: string;
        description: string;
    }>;
    skills: string[];
    certifications: Array<{
        name: string;
        issued_by: string;
        year: number;
    }>;
    projects: Array<{
        name: string;
        description: string;
        technologies: string[];
        links: string[];
    }>;
    languages: string[];
    interests: string[];
}

const DetailsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [resumeDetails, setResumeDetails] = useState<ResumeDetails | null>(
        location.state || null
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const [section, key] = name.split('.');

        console.log(`Input changed: section=${section}, key=${key}, value=${value}`);

        setResumeDetails((prevDetails) => {
            if (!prevDetails) return null;
            return {
                ...prevDetails,
                [section]: {
                    ...prevDetails[section as keyof ResumeDetails],
                    [key]: value,
                },
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!resumeDetails) {
            setErrorMessage('No data to submit.');
            return;
        }

        console.log('Submitting data:', resumeDetails);

        try {
            // Send the updated data to the /uploadData endpoint
            const response = await axios.post('http://localhost:9900/uploadData', resumeDetails);
            console.log('Data uploaded successfully:', response.data);
            setSuccessMessage('Data saved successfully!');
        } catch (error) {
            console.error('Error uploading data:', error);
            setErrorMessage('An error occurred while saving the data.');
        }
    };

    if (!resumeDetails) {
        return <div>No data available. Please upload a file first.</div>;
    }

    return (
        <div className="details-page-container">
            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h2>Personal Information</h2>
                    <div className="form-row">
                        <label>Full Name:</label>
                        <input
                            type="text"
                            name="personal_info.full_name"
                            value={resumeDetails.personal_info.full_name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-row">
                        <label>Email:</label>
                        <input
                            type="text"
                            name="personal_info.email"
                            value={resumeDetails.personal_info.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-row">
                        <label>Phone:</label>
                        <input
                            type="text"
                            name="personal_info.phone"
                            value={resumeDetails.personal_info.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-row">
                        <label>Address:</label>
                        <input
                            type="text"
                            name="personal_info.address"
                            value={resumeDetails.personal_info.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-row">
                        <label>Country:</label>
                        <input
                            type="text"
                            name="personal_info.country"
                            value={resumeDetails.personal_info.country}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Add more sections for education, experience, skills, etc. */}

                <div className="form-actions">
                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                </div>
            </form>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
    );
};

export default DetailsPage;
