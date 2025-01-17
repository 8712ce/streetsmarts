import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { fetchAllTeachers } from "../../utils/api";

function StudentEditModal({ student, onClose, onStudentUpdated }) {
    // LOCAL FORM DATA //
    // const [formData, setFormData] = useState({
    //     firstName: student.firstName || "",
    //     lastName: student.lastName || "",
    //     screenName: student.screenName || "",
    //     teacher: student.teacher || "",
    // });
    // LOCAL STATE FOR TEACHER FIELDS //
    const [studentData, setStudentData] = useState({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        screenName: student.screenName || '',
        teacher: student.teacher || ''
    });

    // LOCAL STATE FOR USER FIELDS //
    const [userData, setUserData] = useState({
        email: user?.email || '',
        password: '',
    });

    const [teachers, setTeachers] = useState([]);

    const token = localStorage.getItem("token") || "";
    const studentId = localStorage.getItem("studentId")
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchAllTeachers()
        .then((res) => setTeachers(res))
        .catch((err) => console.error('Error fetching teachers:', err));
    }, []);



    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({
    //         ...prev,
    //         [name]: value,
    //     }));
    // };



    // UPDATE LOCAL STATE FOR TEACHER FIELDS //
    const handleStudentChange = (e) => {
        const { name, value } = e.target;
        setStudentData(prev => ({ ...prev, [name]: value }));
    };

    // UPDATE LOCAL STATE FOR USER FIELDS //
    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
      };



    const handleTeacherSelect = (e) => {
        setFormData((prev) => ({
            ...prev,
            teacher: e.target.value,
        }));
    };



    // const handleSave = async () => {
    //     try {
    //         await axios.put(`http://localhost:8000/students/${studentId}`,
    //             {
    //                 firstName: formData.firstName,
    //                 lastName: formData.lastName,
    //                 screenName: formData.screenName,
    //                 teacher: formData.teacher
    //             },
    //             config
    //         );
    //         onStudentUpdated({
    //             ...student,
    //             ...formData
    //         });
    //     } catch (err) {
    //         console.error('Error updating student:', err);
    //     }
    // };



    const handleSave = async () => {
        try {
            // UPDATE TEACHER FIELDS //
            await axios.put(
                `http://localhost:8000/students/${student._id}`,
                studentData,
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
            onStudentUpdated({
                ...student,
                ...studentData,
            });
        } catch (err) {
            console.error('Error updating student or user:', err);
        }
    };



    const modalContent = (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h3>Edit Student Profile</h3>

                <div>
                    <strong>First Name:</strong>{' '}
                    <input type="text" name="firstName" value={studentData.firstName} onChange={handleStudentChange} />
                </div>

                <div>
                    <strong>Last Name:</strong>{' '}
                    <input type="text" name="lastName" value={studentData.lastName} onChange={handleStudentChange} />
                </div>

                <div>
                    <strong>Screen Name:</strong>{' '}
                    <input type="text" name="screenName" value={studentData.screenName} onChange={handleStudentChange} />
                </div>

                <div>
                    <strong>Teacher:</strong>{' '}
                    <select name="teacher" value={studentData.teacher} onChange={handleTeacherSelect}>
                        <option value="">-- Select --</option>
                        {teachers.map((t) => (
                            <option key={t._id} value={t._id}>
                                {t.screenName}
                            </option>
                        ))}
                    </select>
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

export default StudentEditModal;