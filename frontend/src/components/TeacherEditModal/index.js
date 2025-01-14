import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

function TeacherEditModal({ teacher, onClose, onTeacherUpdated }) {
    // LOCAL FORM DATA //
    const [formData, setFormData] = useState({
        firstName: teacher.firstName || '',
        lastName: teacher.lastName || '',
        screenName: teacher.screenName || '',
    });

    const token = localStorage.getItem('token') || '';
    const teacherId = localStorage.getItem('teacherID');
    const config = { headers: { Authorization: `Bearer ${token}` } };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    const handleSave = async () => {
        try {
            const res = await axios.put(
                `http://localhost:8000/teachers/${teacherId}`,
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    screenName: formData.screenName
                },
                config
            );
            // IFF SUCCESSFUL, PASS UPDATED DOC BACK //
            onTeacherUpdated(res.data);
        } catch (err) {
            console.error('Error updating teacher:', err);
            // OPTIONAL ERROR MESSAGE //
        }
    };



    const modalContent = (
        <div className='modal-overlay'>
            <div className='modal-content'>
                <button className='close-button' onClick={onClose}>&times;</button>
                
                <h3>Edit Teacher Profile</h3>

                <div>
                    <strong>First Name:</strong>{' '}
                    <input type='text' name='firstName' value={formData.firstName} onChange={handleChange} />
                </div>

                <div>
                    <strong>Last Name:</strong>{' '}
                    <input type='text' name='lastName' value={formData.lastName} onChange={handleChange} />
                </div>

                <div>
                    <strong>Screen Name:</strong>{' '}
                    <input type='text' name='screenName' value={formData.screenName} onChange={handleChange} />
                </div>

                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
}

export default TeacherEditModal;