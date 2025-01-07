import React, { useEffect, useState } from "react";
import axios from "axios";
import { Teacher } from "../../../../backend/models";

function StudentDashboard() {
    const [student, setStudent] = useState({
        firstName: '',
        lastName: '',
        screenName: ''
    });

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const studentId = localStorage.getItem('studentId');
    const token = localStorage.getItem('token') || '';

    // ATTACH AUTHORIZATION HEADER FOR ALL STUDENT-BASED REQUESTS //
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // ON MOUNT, FETCH THE STUDENT'S CURRENT INFO //
    useEffect(() => {
        if (!studentId) {
            setError('No student ID found in localStorage.  Are you sure you are logged in as a student?');
            return;
        }

        axios.get(`http://localhost:8000/students/${studentId}`, config)
        .then((res) => {
            const { firstName, lastName, screenName } = res.data;
            setStudent({
                firstName: firstName || '',
                lastName: lastName || '',
                screenName: screenName || ''
            });
        })
        .catch((err) => {
            console.error('Error fetching student info:', err);
            setError('Could not load student info.  Please try again.');
        });
    }, [studentId]);

    const handleChange = (e) => {
        setStudent({
            ...student,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!studentId) {
            setError('No student ID found.  Cannot update profile.');
            return;
        }

        axios.put(`http://localhost:8000/students/${studentId}`,
        {
            firstName: student.firstName,
            lastName: student.lastName,
            screenName: student.screenName,
            teacher: student.teacher
        },
        config
        )
        .then((res) => {
            console.log('Updated student doc:', res.data);
            setSuccessMsg('Profile updated successfully!');
        })
        .catch((err) => {
            console.error('Error updating student info:', err);
            setError('Could not update profile.  Please try again.');
        });
    };

    return (
        <div className='dashboard_menu'>
            <h2>Student Dashboard</h2>

            {error && <div style={{ color: 'red' }}>{error}</div>}
            {successMsg && <div style={{ color: 'green' }}>{successMsg}</div>}

            <form onSubmit={handleUpdateProfile}>
                <div>
                    <label>First Name:</label>
                    <input type='text' name='firstName' value={student.firstName} onChange={handleChange} />
                </div>

                <div>
                    <label>Last Name:</label>
                    <input type='text' name='lastName' value={student.lastName} onChange={handleChange} />
                </div>

                <div>
                    <label>Screen Name:</label>
                    <input type='text' name='screenName' value={student.screenName} onChange={handleChange} />
                </div>

                <button type='submit'>Update Profile</button>
            </form>
        </div>
    );
}

export default StudentDashboard;