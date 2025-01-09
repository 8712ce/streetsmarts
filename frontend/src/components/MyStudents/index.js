import React, { useEffect, useState } from 'react';
import { fetchStudentsForTeacher } from '../../utils/api';
import StudentDetailModal from '../StudentDetailModal';

import './myStudents.css';

function MyStudents() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);

    // SUPPOSING WE STORE TEH TEACHER'S ID IN LOCALSTORAGE AFTER LOGIN //
    const teacherId = localStorage.getItem('teacherId') || '';

    useEffect(() => {
        if (!teacherId) {
            setError('No teacherId found.  Are you sure you are logged in as a teacher?');
            return;
        }
        fetchStudentsForTeacher(teacherId)
        .then((studentArray) => {
            setStudents(studentArray);
        })
        .catch((err) => {
            console.error('Error fetching students of the teacher:', err);
            setError('Could not load students. Please try again.');
        });
    }, [teacherId]);

    
    
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
                        </li>
                    ))}
                </ul>
            )}

            {selectedStudent && (
                <StudentDetailModal
                    student={selectedStudent}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

export default MyStudents;