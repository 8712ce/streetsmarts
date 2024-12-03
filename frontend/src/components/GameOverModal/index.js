import React from 'react';
import './gameOverModal.css';

const GameOverModal = ({ visible, pedestrianName, vehicleType, onPlayAgain }) => {
    if (!visible) return null;

    return (
        <div className='modal-overlay'>
            <div className='modal-content'>
                <h2>Bummer!</h2>
                <p>
                    {pedestrianName} has been fatally struck by a {vehicleType}!
                </p>
                <p>Would you like to play again?</p>
                <button onClick={onPlayAgain}>Play Again</button>
            </div>
        </div>
    );
};

export default GameOverModal