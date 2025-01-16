import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyStudents from '../MyStudents';
import TeacherEditModal from '../TeacherEditModal';
import TeacherDeleteModal from '../TeacherDeleteModal';

function TeacherDashboard() {

    const [teacher, setTeacher] = useState(null);
    const [userDoc, setUserDoc] = useState(null);
    const [error, setError] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // ASSUMING TEACHER'S ID IS STORED IN LOCALSTORAGE AT LOGIN //
    const teacherId = localStorage.getItem('teacherId');
    const token = localStorage.getItem('token') || '';

    // ATTACH AUTHORIZATION HEADER FOR ALL TEACHER-BASED REQUESTS //
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // ON MOUNT FETCH THE TEACHER'S CURRENT INFO //
    // useEffect(() => {
    //     if (!teacherId) {
    //         setError('No teacher ID found in localStorage.  Are you sure you are logged in as a teacher?');
    //         return;
    //     }
    //     fetchTeacherInfo();
    // }, [teacherId]);



    // const fetchTeacherInfo = async () => {
    //     try {
    //         setError('');
    //         const res = await axios.get(`http://localhost:8000/teachers/${teacherId}`, config);
    //         setTeacher(res.data);
    //     } catch (err) {
    //         console.error('Error fetching teacher info:', err);
    //         setError('Could not load teacher info.  Pleaes try again.');
    //     }
    // };



    // ON MOUNT FETCH THE TEACHER AND USER INFO //
    useEffect(() => {
        if (!teacherId) {
            setError('No teacher ID found in localStorage.  Are you sure you are logged in as a teacher?');
            return;
        }

        async function fetchTeacherAndUser() {
            try {
                setError('');

                // GET THE TEACHER DOC //
                const teacherRes = await axios.get(`http://localhost:8000/teachers/${teacherId}`, config);
                const teacherDoc = teacherRes.data;
                setTeacher(teacherDoc);

                // GET USER DOC //
                const userId = teacherDoc.user;
                if (userId) {
                    const userRes = await axios.get(`http://localhost:8000/users/${userId}`, config);
                    const fullUserDoc = userRes.data;
                    setUserDoc(fullUserDoc);
                }

            } catch (err) {
                console.error('Error fetching teacher or user:', err);
                setError('Could not load teacher or user info.  Please try again.');
            }
        }

        fetchTeacherAndUser();
    }, [teacherId]);



    // OPEN THE EDIT MODAL //
    const handleOpenEditModal = () => {
        setEditModalOpen(true);
    };
    
    const handleCloseEditModal = () => {
        setEditModalOpen(false);
    };



    // CALLED BY TEH MODAL ONCE THE TEACHER IS UPDATED SUCCESSFULLY //
    const handleTeacherUpdated = (updatedTeacher) => {
        // UPDATE THE LOCAL STATE //
        setTeacher(updatedTeacher);
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
        // DELETE /teachers/:teacherId //
        axios.delete(`http://localhost:8000/teachers/${teacherId}`, config)
            .then(() => {
                // CLEAR LOCALSTORAGE, OR REMOVE TEACHER ID //
                localStorage.clear();
                // localStorage.removeItem('teacherId');
                // localStorage.removeItem('token');
                // localStorage.removeItem('userId');
                // localStorage.removeItem('userEmail');
                // localStorage.removeItem('role');
                // REDIRECT TO SIGN IN PAGE //
                window.location.href = '/';
            })
            .catch((err) => {
                console.error('Error deleting teacher:', err);
                setError('Could not delete teacher. Please try again.');
            })
            .finally(() => {
                setDeleteModalOpen(false);
            });
    };



    if (error) {
        return <div className='error_div'>{error}</div>;
    }



    if (!teacher) {
        return <div>Loading teacher info...</div>;
    }



    return (
        <div className='dashboard_menu'>
            <h2>Teacher Dashboard</h2>

            <div>
                <p><strong>First Name:</strong> {teacher.firstName}</p>
                <p><strong>Last Name:</strong> {teacher.lastName}</p>
                <p><strong>Screen Name:</strong> {teacher.screenName}</p>
            </div>

            <button onClick={handleOpenEditModal}>Edit Profile</button>
            <button onClick={handleOpenDeleteModal}>Delete Account</button>

            <hr />

            <MyStudents />

            {editModalOpen && (
                <TeacherEditModal teacher={teacher} user={userDoc} onClose={handleCloseEditModal} onTeacherUpdated={handleTeacherUpdated} />
            )}

            {deleteModalOpen && (
                <TeacherDeleteModal
                    teacherName={teacher.screenName || `${teacher.firstName} ${teacher.lastName}`}
                    onClose={handleCloseDeleteModal}
                    onConfirmDelete={handleConfirmDelete}
                />
            )}
        </div>
    );
}

export default TeacherDashboard;