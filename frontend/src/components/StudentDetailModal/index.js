import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';
import { fetchAllTeachers } from "../../utils/api";

import './studentDetailModal.css';

function StudentDetailModal({ student, onClose, onUpdate }) {

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

    // LIST OF ALL TEACHERS FOR THE DROPDOWN //
    const [teachers, setTeachers] = useState([]);

    const token = localStorage.getItem('token') || '';
    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (!student) return null;



    // ON MOUNT, FETCH THE TEACHER LIST (LIKE IN SIGNUP COMPONENT) //
    useEffect(() => {
        fetchAllTeachers()
        .then((allTeachers) => {
            setTeachers(allTeachers);
        })
        .catch((err) => {
            console.error('Error fetching teacher list:', err);
        });
    }, []);



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
            onClose();
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

                <div>
                    <strong>Teacher:</strong>{' '}
                    {isEditMode ? (
                        <select
                            name="teacher"
                            value={formData.teacher}
                            onChange={handleChange}
                        >
                            <option value="">(No teacher selected)</option>

                            {teachers.map((t) => (
                                <option key={t._id} value={t._id}>
                                    {t.firstName} {t.lastName}
                                </option>
                            ))}
                        </select>
                    ) : (
                        // NON-EDIT MODE: IF YOU WANT TO SHOW TEACHER'S NAME, HAVE THE TEACHER DOC OR A MAP FROM ID -> NAME.  FOR NOW, JUST SHOWING TEACHER ID FROM THE DB //
                        typeof formData.teacher === 'object'
                            ? formData.teacher._id // IF IT'S A POPULATED DOC //
                            : formData.teacher // IF IT'S JUST AN ID //
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

export default StudentDetailModal;