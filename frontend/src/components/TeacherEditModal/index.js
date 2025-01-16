import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './teacherEditModal.css';

function TeacherEditModal({ teacher, user, onClose, onTeacherUpdated }) {
    // LOCAL FORM DATA //
    // const [formData, setFormData] = useState({
    //     firstName: teacher.firstName || '',
    //     lastName: teacher.lastName || '',
    //     screenName: teacher.screenName || '',
    //     email: user.email || '',
    //     password: '',
    // });

    // LOCAL STATE FOR TEACHER FIELDS //
    const [teacherData, setTeacherData] = useState({
        firstName: teacher.firstName || '',
        lastName: teacher.lastName || '',
        screenName: teacher.screenName || ''
    });

    // LOCAL STATE FOR USER FIELDS //
    const [userData, setUserData] = useState({
        email: user?.email || '',
        password: '',
    });



    const token = localStorage.getItem('token') || '';
    const teacherId = localStorage.getItem('teacherId');
    const config = { headers: { Authorization: `Bearer ${token}` } };



    // // UPDATE LOCAL STATE //
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({
    //         ...prev,
    //         [name]: value,
    //     }));
    // };



    // UPDATE LOCAL STATE FOR TEACHER FIELDS //
    const handleTeacherChange = (e) => {
        const { name, value } = e.target;
        setTeacherData(prev => ({ ...prev, [name]: value }));
    };

    // UPDATE LOCAL STATE FOR USER FIELDS //
    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
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



    // const handleSave = async () => {
    //     try {
    //         // UPDATE TEH TEACHER DOC //
    //         await axios.put(
    //             `http://localhost:8000/teachers/${teacherId}`,
    //             {
    //                 firstName: formData.firstName,
    //                 lastName: formData.lastName,
    //                 screenName: formData.screenName
    //             },
    //             config
    //         );

    //         // UPDATE THE USER DOC'S EMAIL AND PASSWORD //
    //         const userId = teacher.user;

    //         // ONLY UPDATE PASSWORD IF THE TEACHER TYPED SOMETHING IN FORMDATA.PASSWORD //
    //         const userBody = {
    //             email: formData.email
    //         };
    //         if (formData.password.trim()) {
    //             userBody.password = formData.password;
    //         }

    //         await axios.put(
    //             `http://localhost:8000/users/${userId}`,
    //             userBody,
    //             config
    //         );

    //         // OPTIONALLY RE-FETCH TEACHER OR USER IF NEEDED //
    //         onTeacherUpdated({
    //             ...teacher,
    //             firstName: formData.firstName,
    //             lastName: formData.lastName,
    //             screenName: formData.screenName
    //         });
    //     } catch (err) {
    //         console.error('Error updating teacher or user:', err);
    //         // OPTIONAL ERROR HANDLING //
    //     }
    // };



    const handleSave = async () => {
        try {
            // UPDATE TEACHER FIELDS //
            await axios.put(
                `http://localhost:8000/teachers/${teacher._id}`,
                teacherData,
                config
            );

            // UPDATE USER FIELDS //
            if (user && user._id) {
                const trimmedPassword = userData.password ? userData.password.trim() : '';
                // ONLY SEND THE PASSWORD FIELD IF THE USER TYPED A NON-BLANK PASSWORD //
                const userBody = { email: userData.email };
                if (trimmedPassword) {
                    userBody.password = trimmedPassword;
                }

                await axios.put(
                    `http://localhost:8000/users/${user._id}`,
                    userBody,
                    config
                );
            }

            // RE-FETCH OR PASS UPDATED DATA UP //
            onTeacherUpdated({
                ...teacher,
                ...teacherData,
            });
        } catch (err) {
            console.error('Error updating teacher or user:', err);
        }
    };



    const modalContent = (
        <div className='modal-overlay'>
            <div className='modal-content'>
                <button className='close-button' onClick={onClose}>&times;</button>
                
                <h3>Edit Teacher Profile</h3>

                {/* <div>
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
                </div> */}

                <div>
                    <strong>First Name:</strong>{' '}
                    <input type='text' name='firstName' value={teacherData.firstName} onChange={handleTeacherChange} />
                </div>

                <div>
                    <strong>Last Name:</strong>{' '}
                    <input type='text' name='lastName' value={teacherData.lastName} onChange={handleTeacherChange} />
                </div>

                <div>
                    <strong>Screen Name:</strong>{' '}
                    <input type='text' name='screenName' value={teacherData.screenName} onChange={handleTeacherChange} />
                </div>

                <div>
                    <strong>Email:</strong>{' '}
                    <input type='email' name='email' value={userData.email} onChange={handleUserChange} />
                </div>

                <div>
                    <strong>Password:</strong>{' '}
                    <input type='password' name='password' value={userData.password} onChange={handleUserChange} />
                    <p>* Leave password blank if you don't want to change it.</p>
                </div>

                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
}

export default TeacherEditModal;