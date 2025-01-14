import React, { useEffect, useState } from 'react';
import { fetchStudentsForTeacher } from '../../utils/api';
import StudentDetailModal from '../StudentDetailModal';
import StudentDeleteModal from '../StudentDeleteModal';
import axios from 'axios';

import './myStudents.css';


function MyStudents() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editStudent, setEditStudent] = useState(null);
    const [deleteStudent, setDeleteStudent] = useState(null);

    const token = localStorage.getItem('token') || '';
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // SUPPOSING WE STORE TEH TEACHER'S ID IN LOCALSTORAGE AFTER LOGIN //
    const teacherId = localStorage.getItem('teacherId') || '';

    const refreshStudentList = async () => {
        try {
            setError('');
            const studentArray = await fetchStudentsForTeacher(teacherId);
            setStudents(studentArray);
        } catch (err) {
            console.error('Error featching students of the teacher:', err);
            setError('Could not load students. Please try again.');
        }
    };

    useEffect(() => {
        if (!teacherId) {
            setError('No teacherId found. Are you sure you are logged in as a teacher?');
            return;
        }
        refreshStudentList();
    }, [teacherId]);



    // CALLED WHEN CLOSING AN EDIT MODAL //
    const handleModalClose = () => {
        setEditStudent(null);
    };



    // CALLED WEHN THE TEACHER CONFIRMS DELETE FOR THE GIVEN STUDENT //
    const handleDeleteConfirmed = async (studentId) => {
        try {
            await axios.delete(`http://localhost:8000/students/${studentId}`, config);
            refreshStudentList();
            // CLOSE THE DELETE MODAL //
            setDeleteStudent(null);
        } catch (err) {
            console.error('Error deleting student:', err);
            setError('Could not delete student. Please try again.');
        }
    };

    
    
    const handleStudentClick = (student) => {
        setSelectedStudent(student);
    };



    const handleCloseModal = () => {
        setSelectedStudent(null);
    };



    if (error) {
        return <div>{error}</div>;
    }



    return (
        <div>
            <h2>My Students</h2>
            {students.length === 0 ? (
                <p>No students found.</p>
            ) : (
                <ul>
                    {students.map((s) => (
                        <li key={s._id}>
                            <button type='button' className='student_button' onClick={() => handleStudentClick(s)}>
                                {s.firstName} {s.lastName} (ScreenName: {s.screenName})
                            </button>

                            <button type='button' onClick={() => setEditStudent(s)}>Edit</button>

                            <button type='button' onClick={() => setDeleteStudent(s)}>Delete</button>
                        </li>
                    ))}

                    {editStudent && (
                        <StudentDetailModal
                            student={editStudent}
                            defaultEditMode={true}
                            onClose={handleModalClose}
                            onUpdate={refreshStudentList}
                        />
                    )}

                    {deleteStudent && (
                        <StudentDeleteModal
                            studentName={deleteStudent.screenName}
                            onConfirmDelete={() => handleDeleteConfirmed(deleteStudent._id)}
                            onClose={() => setDeleteStudent(null)}
                        />
                    )}
                </ul>
            )}

            {selectedStudent && (
                <StudentDetailModal
                    student={selectedStudent}
                    onClose={handleCloseModal}
                    onUpdate={refreshStudentList}
                />
            )}
        </div>
    );
}

export default MyStudents;