import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DetailsPage.css';
import { serviceUrl } from '../config';

// Defines the type for personal information.
interface PersonalInfo {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    country: string;
}

// Defines the type for education details.
interface Education {
    qualification: string;
    institution: string;
    location: string;
    gpa: string;
    year: number;
}

// Defines the type for experience details.
interface Experience {
    company: string;
    description: string;
    duration: string;
}

// Defines the type for certifications.
interface Certification {
    name: string;
    issued_by: string;
    year: number;
}

// Defines the type for projects.
interface Project {
    name: string;
    description: string;
    technologies: string[];
    links: string[];
}

// Defines the record type for the extracted resume content.
interface ResumeRecord {
    personal_info: PersonalInfo;
    education: Education[];
    experience: Experience[];
    skills: string[];
    programming_languages: string[];
    certifications: Certification[];
    projects: Project[];
    languages: string[];
    interests: string[];
    jobRole?: string; // Added jobRole as an optional field
}

const DetailsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const jobRole = state?.jobRole || '';
    const [resumeDetails, setResumeDetails] = useState<ResumeRecord>({
        personal_info: {
            full_name: '',
            email: '',
            phone: '',
            address: '',
            country: '',
        },
        education: [],
        experience: [],
        skills: [],
        programming_languages: [],
        certifications: [],
        projects: [],
        languages: [],
        interests: [],
        jobRole: jobRole, // Initialize jobRole
        ...(state || {})
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const [section, key] = name.split('.');

        setResumeDetails((prevDetails) => {
            return {
                ...prevDetails,
                [section]: {
                    ...(prevDetails[section as keyof ResumeRecord] as object),
                    [key]: value,
                },
            };
        });
    };

    const handleArrayInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        section: keyof ResumeRecord,
        index: number,
        key: string
    ) => {
        const { value } = e.target;

        setResumeDetails((prevDetails) => {
            const updatedArray = [...prevDetails[section] as any[]];
            updatedArray[index] = {
                ...updatedArray[index],
                [key]: value,
            };
            return {
                ...prevDetails,
                [section]: updatedArray,
            };
        });
    };

    const handleSimpleArrayInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        section: keyof ResumeRecord,
        index: number
    ) => {
        const { value } = e.target;

        setResumeDetails((prevDetails) => {
            const updatedArray = [...prevDetails[section] as string[]];
            updatedArray[index] = value;
            return {
                ...prevDetails,
                [section]: updatedArray,
            };
        });
    };

    const handleNestedArrayInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        section: keyof ResumeRecord,
        index: number,
        nestedKey: string,
        nestedIndex: number
    ) => {
        const { value } = e.target;

        setResumeDetails((prevDetails) => {
            const updatedArray = [...prevDetails[section] as any[]];
            const nestedArray = [...updatedArray[index][nestedKey]];
            nestedArray[nestedIndex] = value;
            updatedArray[index] = {
                ...updatedArray[index],
                [nestedKey]: nestedArray,
            };
            return {
                ...prevDetails,
                [section]: updatedArray,
            };
        });
    };

    const addNewField = (section: keyof ResumeRecord, defaultValue: any) => {
        setResumeDetails((prevDetails) => {
            const updatedArray = [...prevDetails[section] as any[], defaultValue];
            return {
                ...prevDetails,
                [section]: updatedArray,
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Submitting data:', resumeDetails);

        try {
            const response = await axios.post(`${serviceUrl}/userDetails`, {
                personal_info: resumeDetails.personal_info,
                education: resumeDetails.education,
                experience: resumeDetails.experience,
                skills: resumeDetails.skills,
                programming_languages: resumeDetails.programming_languages,
                certifications: resumeDetails.certifications,
                projects: resumeDetails.projects,
                languages: resumeDetails.languages,
                interests: resumeDetails.interests,
                jobRole: resumeDetails.jobRole,
            });
            console.log('Data uploaded successfully:', response.data);
            setSuccessMessage('Data saved successfully!');

            // Redirect to the /assignment page with the response data
            navigate('/assignment', { state: { responseData: response.data } });
        } catch (error) {
            console.error('Error uploading data:', error);
            setErrorMessage('An error occurred while saving the data.');
        }
    };

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

                <div className="form-section">
                    <h2>Education</h2>
                    {resumeDetails.education.map((edu, index) => (
                        <div key={index} className="form-row">
                            <label>Qualification:</label>
                            <input
                                type="text"
                                value={edu.qualification}
                                onChange={(e) => handleArrayInputChange(e, 'education', index, 'qualification')}
                            />
                            <label>Institution:</label>
                            <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => handleArrayInputChange(e, 'education', index, 'institution')}
                            />
                            <label>Location:</label>
                            <input
                                type="text"
                                value={edu.location}
                                onChange={(e) => handleArrayInputChange(e, 'education', index, 'location')}
                            />
                            <label>GPA:</label>
                            <input
                                type="text"
                                value={edu.gpa}
                                onChange={(e) => handleArrayInputChange(e, 'education', index, 'gpa')}
                            />
                            <label>Year:</label>
                            <input
                                type="number"
                                value={edu.year}
                                onChange={(e) => handleArrayInputChange(e, 'education', index, 'year')}
                            />
                        </div>
                    ))}
                    <button type="button" className="add-button" onClick={() => addNewField('education', { qualification: '', institution: '', location: '', gpa: '', year: 0 })}>
                        + Add Education
                    </button>
                </div>

                <div className="form-section">
                    <h2>Experience</h2>
                    {resumeDetails.experience.map((exp, index) => (
                        <div key={index} className="form-row">
                            <label>Company:</label>
                            <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleArrayInputChange(e, 'experience', index, 'company')}
                            />
                            <label>Description:</label>
                            <textarea
                                value={exp.description}
                                onChange={(e) => handleArrayInputChange(e, 'experience', index, 'description')}
                            />
                            <label>Duration:</label>
                            <input
                                type="text"
                                value={exp.duration}
                                onChange={(e) => handleArrayInputChange(e, 'experience', index, 'duration')}
                            />
                        </div>
                    ))}
                    <button type="button" className="add-button" onClick={() => addNewField('experience', { company: '', description: '', duration: '' })}>
                        + Add Experience
                    </button>
                </div>

                <div className="form-section">
                    <h2>Skills</h2>
                    {resumeDetails.skills.map((skill, index) => (
                        <div key={index} className="form-row">
                            <input
                                type="text"
                                value={skill}
                                onChange={(e) => handleSimpleArrayInputChange(e, 'skills', index)}
                            />
                        </div>
                    ))}
                    <button type="button" className="add-button" onClick={() => addNewField('skills', '')}>
                        + Add Skill
                    </button>
                </div>

                <div className="form-section">
                    <h2>Programming Languages</h2>
                    {resumeDetails.programming_languages.map((language, index) => (
                        <div key={index} className="form-row">
                            <input
                                type="text"
                                value={language}
                                onChange={(e) => handleSimpleArrayInputChange(e, 'programming_languages', index)}
                            />
                        </div>
                    ))}
                    <button type="button" className="add-button" onClick={() => addNewField('programming_languages', '')}>
                        + Add Programming Language
                    </button>
                </div>

                <div className="form-section">
                    <h2>Certifications</h2>
                    {resumeDetails.certifications.map((cert, index) => (
                        <div key={index} className="form-row">
                            <label>Name:</label>
                            <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => handleArrayInputChange(e, 'certifications', index, 'name')}
                            />
                            <label>Issued By:</label>
                            <input
                                type="text"
                                value={cert.issued_by}
                                onChange={(e) => handleArrayInputChange(e, 'certifications', index, 'issued_by')}
                            />
                            <label>Year:</label>
                            <input
                                type="number"
                                value={cert.year}
                                onChange={(e) => handleArrayInputChange(e, 'certifications', index, 'year')}
                            />
                        </div>
                    ))}
                    <button type="button" className="add-button" onClick={() => addNewField('certifications', { name: '', issued_by: '', year: 0 })}>
                        + Add Certification
                    </button>
                </div>

                <div className="form-section">
                    <h2>Projects</h2>
                    {resumeDetails.projects.map((project, index) => (
                        <div key={index} className="form-row">
                            <label>Name:</label>
                            <input
                                type="text"
                                value={project.name}
                                onChange={(e) => handleArrayInputChange(e, 'projects', index, 'name')}
                            />
                            <label>Description:</label>
                            <textarea
                                value={project.description}
                                onChange={(e) => handleArrayInputChange(e, 'projects', index, 'description')}
                            />
                            <label>Technologies:</label>
                            {project.technologies.map((tech, techIndex) => (
                                <input
                                    key={techIndex}
                                    type="text"
                                    value={tech}
                                    onChange={(e) => handleNestedArrayInputChange(e, 'projects', index, 'technologies', techIndex)}
                                />
                            ))}
                            <button type="button" className="add-button" onClick={() => {
                                const updatedProjects = [...resumeDetails.projects];
                                updatedProjects[index].technologies.push('');
                                setResumeDetails({ ...resumeDetails, projects: updatedProjects });
                            }}>
                                + Add Technology
                            </button>
                            <label>Links:</label>
                            {project.links.map((link, linkIndex) => (
                                <input
                                    key={linkIndex}
                                    type="text"
                                    value={link}
                                    onChange={(e) => handleNestedArrayInputChange(e, 'projects', index, 'links', linkIndex)}
                                />
                            ))}
                            <button type="button" className="add-button" onClick={() => {
                                const updatedProjects = [...resumeDetails.projects];
                                updatedProjects[index].links.push('');
                                setResumeDetails({ ...resumeDetails, projects: updatedProjects });
                            }}>
                                + Add Link
                            </button>
                        </div>
                    ))}
                    <button type="button" className="add-button" onClick={() => addNewField('projects', { name: '', description: '', technologies: [''], links: [''] })}>
                        + Add Project
                    </button>
                </div>

                <div className="form-section">
                    <h2>Languages</h2>
                    {resumeDetails.languages.map((language, index) => (
                        <div key={index} className="form-row">
                            <input
                                type="text"
                                value={language}
                                onChange={(e) => handleSimpleArrayInputChange(e, 'languages', index)}
                            />
                        </div>
                    ))}
                    <button type="button" className="add-button" onClick={() => addNewField('languages', '')}>
                        + Add Language
                    </button>
                </div>

                <div className="form-section">
                    <h2>Interests</h2>
                    {resumeDetails.interests.map((interest, index) => (
                        <div key={index} className="form-row">
                            <input
                                type="text"
                                value={interest}
                                onChange={(e) => handleSimpleArrayInputChange(e, 'interests', index)}
                            />
                        </div>
                    ))}
                    <button type="button" className="add-button" onClick={() => addNewField('interests', '')}>
                        + Add Interest
                    </button>
                </div>

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
