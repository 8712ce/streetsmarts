import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyStudents from '../MyStudents';

function TeacherDashboard() {
    // STATE TO HOLD TEACHER INFO //
    const [teacher, setTeacher] = useState({
        firstName: '',
        lastName: '',
        screenName: '',
    });

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // ASSUMING TEACHER'S ID IS STORED IN LOCALSTORAGE AT LOGIN //
    const teacherId = localStorage.getItem('teacherId');
    const token = localStorage.getItem('token') || '';

    // ATTACH AUTHORIZATION HEADER FOR ALL TEACHER-BASED REQUESTS //
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // ON MOUNT FETCH THE TEACHER'S CURRENT INFO //
    useEffect(() => {
        if (!teacherId) {
            setError('No teacher ID found in localStorage.  Are you sure you are logged in as a teacher?');
            return;
        }

        axios.get(`http://localhost:8000/teachers/${teacherId}`, config)
        .then((res) => {
            const { firstName, lastName, screenName } = res.data;
            setTeacher((prev) => ({
                ...prev,
                firstName: firstName || '',
                lastName: lastName || '',
                screenName: screenName || ''
            }));
        })
        .catch((err) => {
            console.error('Error fetching teacher info:', err);
            setError('Could not load teacher infor.  Please try again.');
        });
    }, [teacherId]);

    // HANDLE INPUT CHANGES IN THE UPDATE FORM //
    const handleChange = (e) => {
        setTeacher({
            ...teacher,
            [e.target.name]: e.target.value
        });
    };

    // HANDLE SUBMITTING THE UPDATE FORM //
    const handleUpdateProfile = (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!teacherId) {
            setError('No teacher ID found. Cannot update profile.');
            return;
        }

        // PUT /TEACHERS/:TEACHERID => BACKEND ROUTE FOR UPDATING TEACHER DOC //
        axios.put(`http://localhost:8000/teachers/${teacherId}`,
            {
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                screenName: teacher.screenName
            },
            config
        )
        .then((res) => {
            console.log('Updated teacher doc:', res.data);
            setSuccessMsg('Profile updated successfully!');
        })
        .catch((err) => {
            console.error('Error updating teacher info:', err);
            setError('Could not update profile. Please try again.');
        });
    };

    return (
        <div className='dashboard_menu'>
            <h2>Teacher Dashboard</h2>

            {error && <div style={{ color: 'red' }}>{error}</div>}
            {successMsg && <div style={{ color: 'green' }}>{successMsg}</div>}

            <form onSubmit={handleUpdateProfile}>
                <div>
                    <label>First Name:</label>
                    <input type='text' name='firstName' value={teacher.firstName} onChange={handleChange} />
                </div>

                <div>
                    <label>Last Name:</label>
                    <input type='text' name='lastName' value={teacher.lastName} onChange={handleChange} />
                </div>

                <div>
                    <label>Screen Name:</label>
                    <input type='text' name='screenName' value={teacher.screenName} onChange={handleChange} />
                </div>

                <button type='submit'>Update Profile</button>
            </form>

            <hr />

            <MyStudents />
        </div>
    );
}

export default TeacherDashboard;