import React from "react";
import ReactDOM from "react-dom";

function TeacherDeleteModal({ teacherName, onClose, onConfirmDelete }) {
    const modalContent = (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>&times;</button>

                <h3>Delete Teacher Account</h3>
                <p>Are you sure you want to delete the account for <strong>{teacherName}</strong>?</p>
                <p>This action cannot be undone!</p>

                <div>
                    <button onClick={onConfirmDelete}>Delete Account</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
}

export default TeacherDeleteModal;