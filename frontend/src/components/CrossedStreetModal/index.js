import React from 'react';
import ReactDOM from 'react-dom';
import './crossedStreetModal.css';

const CrossedStreetModal = ({ visible, pedestrianName, pedestrianScore, onContinueAdventure }) => {
    if (!visible) return null;

    const modalContent = (
        <div className="crossed-street-modal-overlay">
            <div className="crossed-street-modal-content">
                <h2>Congratulations {pedestrianName}!</h2>
                <p>You safely crossed the street!</p>
                <h3>Score: {pedestrianScore}</h3>
                <p>Would you like to continue your adventure?</p>
                <button onClick={onContinueAdventure}>Continue</button>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
};

export default CrossedStreetModal