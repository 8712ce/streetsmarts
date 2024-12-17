import React from "react";
import './beginnerGuide.css';

function BeginnerGuide({ showLookButtons, showLookHelp, showMoveHelp }) {
    return (
        <div className="beginner-guide-container">

            {showMoveHelp && (
                <div className="guide-bubble guide-bubble-move">
                    <p>Use these buttons to move your player forward or backward.</p>
                </div>
            )}

            {showLookButtons && showLookHelp && (
                <div className="guide-bubble guide-bubble-look">
                    <p>Use these buttons to look left and right to see if vehicles are approaching.  You'll earn points!</p>
                </div>
            )}
        </div>
    );
};

export default BeginnerGuide;