import React from "react";
import ReactDOM from 'react-dom';
import './studentDetailModal.css';

function studentDetailModal({ student, onClose }) {
    if (!student) return null;

    const modalContent = (
        <div className="student-detail-modal-overlay">
            <div className="student-detail-modal-content">
                <button className="close-button" onClick={onClose}>&times;</button>

                <h3>Student Profile</h3>
                <p><strong>First Name:</strong> {student.firstName}</p>
                <p><strong>Last Name:</strong> {student.lastName}</p>
                <p><strong>Screen Name:</strong> {student.screenName}</p>
                <p><strong>Level:</strong> {student.level}</p>
                <p><strong>Score:</strong> {student.score}</p>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
}

export default studentDetailModal;