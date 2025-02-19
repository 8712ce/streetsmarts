import React from 'react';
import ReactDOM from 'react-dom';
import './crossedStreetModal.css';

const CrossedStreetModal = ({
    visible,
    studentName,
    teacherName,
    studentTotalScore,
    teacherTotalScore,
    destinationReached,
    adventureLabel,
    onContinueAdventure,
    onExit
}) => {
    if (!visible) return null;

    // USE TEACHER INFO IF PRESENT, OTHERWISE FALLBACK TO STUDENT INFO //
    const displayName = teacherName || studentName;
    const totalScore = teacherName ? teacherTotalScore : studentTotalScore;
    const canContinue = !destinationReached;

    const modalContent = (
        <div className="crossed-street-modal-overlay">
            <div className="crossed-street-modal-content">
                {/* <h2>Congratulations {studentName}!</h2> */}
                <h2>Congratulations {displayName}!</h2>
                <p>You safely crossed the street!</p>
                {/* <h3>Your pedestrian had {pedestrianScore} for this intersection.</h3> */}
                {/* <p>Total Score: {studentTotalScore}</p> */}
                <p>Total Score: {totalScore}</p>

                {canContinue ? (
                    <>
                        <p>Would you like to continue your adventure?</p>
                        <button onClick={onContinueAdventure}>Continue</button>
                    </>
                ) : (
                    <>
                        {/* <p>You've reached {threshold} points!</p> */}
                        <p>You've reached the {adventureLabel}!</p>
                        <button onClick={onExit}>Exit</button>
                    </>
                )}
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
};

export default CrossedStreetModal