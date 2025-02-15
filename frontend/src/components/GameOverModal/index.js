import React from 'react';
import ReactDOM from 'react-dom';
import './gameOverModal.css';

const GameOverModal = ({ visible, studentName, teacherName, vehicleType, onPlayAgain }) => {
    if (!visible) return null;

    // USE TEACHER NAME IF PROVIDED, OTHERWISE FALLBACK TO STUDENT NAME //
    const displayName = teacherName || studentName;

    const modalContent = (
        <div className="game-over-modal-overlay">
            <div className="game-over-modal-content">
                <h2>Bummer!</h2>
                {/* <p>{studentName} was fatally struck by a {vehicleType}!</p> */}
                <p>{displayName} was fatally struck by a {vehicleType}!</p>
                <button onClick={onPlayAgain}>Play Again</button>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
};

export default GameOverModal