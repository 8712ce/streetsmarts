import React, { useState } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';

import './studentDetailModal.css';

function studentDetailModal({ student, onClose, onUpdate }) {
    if (!student) return null;

    // WHETHER CURRENTLY IN EDITING OR VIEWING MODE //
    const [isEditMode, setIsEditMode] = useState(false);

    // LOCAL STATE FOR ALL FIELDS WE WANT TO EDIT //
    const [formData, setFormData] = useState({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        screenName: student.screenName || '',
        level: student.level || '',
        score: student.score || 0,
        teacher: student.teacher || ''
    });

    const token = localStorage.getItem('token') || '';
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // TOGGLE THE ENTIRE MODAL BETWEEN "VIEW" AND "EDIT" MODES //
    const handleToggleEdit = () => {
        setIsEditMode((prev) => !prev);
    };

    // UPDATE LOCAL FORM STATE ON INPUT CHANGES //
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // SAVE ALL FIELDS IN ONE GO //
    const handleSave = async () => {
        try {
            // PUT /students/:studentId
            const studentId = student._id;
            await axios.put(
                `http://localhost:8000/students/${studentId}`,
                formData,
                config
            );

            // OPTIONALLY REFRESH THE PARENT LIST //
            if (onUpdate) {
                onUpdate();
            }
            // SWITCH BACK TO VIEW MODE //
            setIsEditMode(false);
        } catch (err) {
            console.error('Error updating student:', err);
        }
    };



    const modalContent = (
        <div className="student-detail-modal-overlay">
            <div className="student-detail-modal-content">
                <button className="close-button" onClick={onClose}>&times;</button>

                <h3>Student Profile</h3>
                {/* <p><strong>First Name:</strong> {student.firstName}</p>
                <p><strong>Last Name:</strong> {student.lastName}</p>
                <p><strong>Screen Name:</strong> {student.screenName}</p>
                <p><strong>Level:</strong> {student.level}</p>
                <p><strong>Score:</strong> {student.score}</p> */}
                <div>
                    <strong>First Name:</strong>{' '}
                    {isEditMode ? (
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    ) : (
                        formData.firstName
                    )}
                </div>

                <div>
                    <strong>Last Name:</strong>{' '}
                    {isEditMode ? (
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    ) : (
                        formData.lastName
                    )}
                </div>

                <div>
                    <strong>Screen Name:</strong>{' '}
                    {isEditMode ? (
                        <input
                            type="text"
                            name="screenName"
                            value={formData.screenName}
                            onChange={handleChange}
                        />
                    ) : (
                        formData.screenName
                    )}
                </div>

                <div>
                    <strong>Score:</strong>{' '}
                    {isEditMode ? (
                        <input
                            type="number"
                            name="score"
                            value={formData.score}
                            onChange={handleChange}
                        />
                    ) : (
                        formData.score
                    )}
                </div>

                {!isEditMode ? (
                    <button onClick={handleToggleEdit}>Edit</button>
                ) : (
                    <button onClick={handleSave}>Save</button>
                )}
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
}

export default studentDetailModal;