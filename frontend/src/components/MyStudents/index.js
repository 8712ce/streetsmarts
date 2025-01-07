import React, { useEffect, useState } from 'react';
import { fectchStudentsForTeachers, fetchStudentsForTeacher } from '../../utils/api';

function MyStudents() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');

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
                            {s.firstName} {s.lastName} (ScreenName: {s.screenName})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MyStudents;