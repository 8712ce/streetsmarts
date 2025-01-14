import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { fetchAllTeachers } from "../../utils/api";

function StudentEditModal({ student, onClose, onStudentUpdated }) {
    // LOCAL FORM DATA //
    const [formData, setFormData] = useState({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        screenName: student.screenName || "",
        teacher: student.teacher || "",
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



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    const handleTeacherSelect = (e) => {
        setFormData((prev) => ({
            ...prev,
            teacher: e.target.value,
        }));
    };



    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:8000/students/${studentId}`,
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    screenName: formData.screenName,
                    teacher: formData.teacher
                },
                config
            );
            onStudentUpdated({
                ...student,
                ...formData
            });
        } catch (err) {
            console.error('Error updating student:', err);
        }
    };



    const modalContent = (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h3>Edit Student Profile</h3>

                <div>
                    <strong>First Name:</strong>{' '}
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                </div>

                <div>
                    <strong>Last Name:</strong>{' '}
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>

                <div>
                    <strong>Screen Name:</strong>{' '}
                    <input type="text" name="screenName" value={formData.screenName} onChange={handleChange} />
                </div>

                <div>
                    <strong>Teacher:</strong>{' '}
                    <select name="teacher" value={formData.teacher} onChange={handleTeacherSelect}>
                        <option value="">-- Select --</option>
                        {teachers.map((t) => (
                            <option key={t._id} value={t._id}>
                                {t.screenName}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
}

export default StudentEditModal;