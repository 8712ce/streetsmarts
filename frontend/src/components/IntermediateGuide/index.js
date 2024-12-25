import React from "react";
import './intermediateGuide.css';

function IntermediateGuide({ showStreetCornerReminder, showCenterLineReminder }) {

    const showMoveHelp = (tutorialStep === 1);

    return (
        <div className="intermediate-guide-container">

            {showStreetCornerReminder && (
                <div className="intermediate-bubble bubble-street-corner">
                    <p>Have you looked both ways before crossing?</p>
                </div>
            )}

            {showCenterLineReminder && (
                <div className="intermediate-bubble bubble-center-line">
                    <p>It might be a good idea to look both ways again.</p>
                </div>
            )}
        </div>
    );
};

export default IntermediateGuide;