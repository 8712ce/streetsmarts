import React from 'react';
import ReactDOM from 'react-dom';
import './gameOverModal.css';

const GameOverModal = ({ visible, pedestrianName, vehicleType, onPlayAgain }) => {
    if (!visible) return null;

    const modalContent = (
        <div className="game-over-modal-overlay">
            <div className="game-over-modal-content">
                <h2>Bummer!</h2>
                <p>{pedestrianName} was fatally struck by a {vehicleType}!</p>
                <button onClick={onPlayAgain}>Play Again</button>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
};

export default GameOverModal