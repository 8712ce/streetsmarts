import React from 'react';
import ReactDOM from 'react-dom';
import './crossedStreetModal.css';

const CrossedStreetModal = ({
    visible,
    // pedestrianName,
    // pedestrianScore,
    studentName,
    studentTotalScore,
    threshold,
    onContinueAdventure,
    onExit
}) => {
    if (!visible) return null;

    const canContinue = studentTotalScore < threshold;

    const modalContent = (
        <div className="crossed-street-modal-overlay">
            <div className="crossed-street-modal-content">
                <h2>Congratulations {studentName}!</h2>
                <p>You safely crossed the street!</p>
                {/* <h3>Your pedestrian had {pedestrianScore} for this intersection.</h3> */}
                <p>Total Score: {studentTotalScore}</p>

                {canContinue ? (
                    <>
                        <p>Would you like to continue your adventure?</p>
                        <button onClick={onContinueAdventure}>Continue</button>
                    </>
                ) : (
                    <>
                        {/* <p>You've reached {threshold} points!</p> */}
                        <p>You've reached the bank!</p>
                        <button onClick={onExit}>Exit</button>
                    </>
                )}
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
};

export default CrossedStreetModal