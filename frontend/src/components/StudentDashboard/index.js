import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentEditModal from "../StudentEditModal";
import StudentDeleteModal from "../StudentDeleteModal";

function StudentDashboard() {
    const [student, setStudent] = useState(null);
    const [error, setError] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
        fetchStudentInfo();
    }, [studentId]);



    const fetchStudentInfo = async () => {
        try {
            setError('');
            const res = await axios.get(`http://localhost:8000/students/${studentId}`, config);
            setStudent(res.data);
        } catch (err) {
            console.error('Error fetching student info:', err);
            setError('Could not load student info. Please try again.');
        }
    };



    const handleOpenEditModal = () => {
        setEditModalOpen(true);
    };



    const handleCloseEditModal = () => {
        setEditModalOpen(false);
    };



    const handleStudentUpdated = (updatedStudent) => {
        setStudent(updatedStudent);
        setEditModalOpen(false);
    };



    // OPEN THE DELETE MODAL //
    const handleOpenDeleteModal = () => {
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
    };



    // CALLED BY THE MODAL IF USER CONFIRMS DELETION //
    const handleConfirmDelete = () => {
        // DELETE /students/:studentId //
        axios.delete(`http://localhost:8000/students/${studentId}`, config)
            .then(() => {
                // CLEAR LOCALSTORAGE, OR REMOVE TEACHER ID //
                localStorage.clear();
                // localStorage.removeItem('studentId');
                // localStorage.removeItem('token');
                // localStorage.removeItem('userId');
                // localStorage.removeItem('userEmail');
                // localStorage.removeItem('role');
                // REDIRECT TO SIGN IN PAGE //
                window.location.href = '/';
            })
            .catch((err) => {
                console.error('Error deleting student:', err);
                setError('Could not delete student. Please try again.');
            })
            .finally(() => {
                setDeleteModalOpen(false);
            });
    };



    if (error) {
        return <div>{error}</div>;
    }



    if (!student) {
        return <div>Loading student info...</div>;
    }



    return (
        <div className='dashboard_menu'>
            <h2>Student Dashboard</h2>

            <p><strong>First Name:</strong> {student.firstName}</p>
            <p><strong>Last Name:</strong> {student.lastName}</p>
            <p><strong>Screen Name:</strong> {student.screenName}</p>

            <button onClick={handleOpenEditModal}>Edit Profile</button>
            <button onClick={handleOpenDeleteModal}>Delete Account</button>

            {editModalOpen && (
                <StudentEditModal
                    student={student}
                    onClose={handleCloseEditModal}
                    onStudentUpdated={handleStudentUpdated}
                />
            )}

            {deleteModalOpen && (
                <StudentDeleteModal
                    studentName={student.screenName || `${student.firstName} ${student.lastName}`}
                    onClose={handleCloseDeleteModal}
                    onConfirmDelete={handleConfirmDelete}
                />
            )}
        </div>
    );
}

export default StudentDashboard;