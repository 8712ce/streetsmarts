import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './teacherEditModal.css';

function TeacherEditModal({ teacher, onClose, onTeacherUpdated, userEmail }) {
    // LOCAL FORM DATA //
    const [formData, setFormData] = useState({
        firstName: teacher.firstName || '',
        lastName: teacher.lastName || '',
        screenName: teacher.screenName || '',
        email: userEmail || '',
        password: '',
    });

    const token = localStorage.getItem('token') || '';
    const teacherId = localStorage.getItem('teacherId');
    const config = { headers: { Authorization: `Bearer ${token}` } };



    // UPDATE LOCAL STATE //
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    // const handleSave = async () => {
    //     try {
    //         const res = await axios.put(
    //             `http://localhost:8000/teachers/${teacherId}`,
    //             {
    //                 firstName: formData.firstName,
    //                 lastName: formData.lastName,
    //                 screenName: formData.screenName
    //             },
    //             config
    //         );
    //         // IFF SUCCESSFUL, PASS UPDATED DOC BACK //
    //         onTeacherUpdated(res.data);
    //     } catch (err) {
    //         console.error('Error updating teacher:', err);
    //         // OPTIONAL ERROR MESSAGE //
    //     }
    // };
    const handleSave = async () => {
        try {
            // UPDATE TEH TEACHER DOC //
            await axios.put(
                `http://localhost:8000/teachers/${teacherId}`,
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    screenName: formData.screenName
                },
                config
            );

            // UPDATE THE USER DOC'S EMAIL AND PASSWORD //
            const userId = teacher.user;

            // ONLY UPDATE PASSWORD IF THE TEACHER TYPED SOMETHING IN FORMDATA.PASSWORD //
            const userBody = {
                email: formData.email
            };
            if (formData.password.trim()) {
                userBody.password = formData.password;
            }

            await axios.put(
                `http://localhost:8000/users/${userId}`,
                userBody,
                config
            );

            // OPTIONALLY RE-FETCH TEACHER OR USER IF NEEDED //
            onTeacherUpdated({
                ...teacher,
                firstName: formData.firstName,
                lastName: formData.lastName,
                screenName: formData.screenName
            });
        } catch (err) {
            console.error('Error updating teacher or user:', err);
            // OPTIONAL ERROR HANDLING //
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

                <div>
                    <strong>Email:</strong>{' '}
                    <input type='email' name='email' value={formData.email} onChange={handleChange} />
                </div>

                <div>
                    <strong>Password:</strong>{' '}
                    <input type='password' name='password' value={formData.password} onChange={handleChange} />
                    <p>* Leave password blank if you don't want to change it.</p>
                </div>

                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
}

export default TeacherEditModal;