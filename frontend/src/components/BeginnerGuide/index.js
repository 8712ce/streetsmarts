import React from "react";
import './beginnerGuide.css';

function BeginnerGuide({
    showLookButtons,
    showMoveHelp,
    showLookLeftHelp,
    showLookRight1Help,
    showLookCenterHelp,
    showCrossStreet1Help,
    showLookRight2Help,
    showCrossStreet2Help
}) {
    return (
        <div className="beginner-guide-container">

            {/* MOVE HELP BUBBLE */}
            <div className={`guide-bubble guide-bubble-move ${showMoveHelp ? 'visible' : ''}`}>
                <p>Use these buttons to move your player forward or backward.</p>
            </div>

            {/* LOOK LEFT HELP BUBBLE */}
            {showLookButtons && (
                <div className={`guide-bubble guide-bubble-look ${showLookLeftHelp ? 'visible' : ''}`}>
                    <p>You are now standing at the corner of an intersection.  In order to cross safely, it's essential to look left and right to see if vehicles are approaching.  You'll earn points!  Let's start by looking left.</p>
                </div>
            )}

            {/* LOOK RIGHT HELP #1: APPEARS AFTER THE USER HAS LOOKED LEFT AND WE TOGGLE showLookRight1Help */}
            <div className={`guide-bubble guide-bubble-look-right-1 ${showLookRight1Help ? 'visible' : ''}`}>
                <p>Great.  Now use the "Look Right" button to look right.</p>
            </div>

            {/* LOOK CENTER HELP: APPEARS AFTER THE USER HAS LOOKED BOTH WAYS AND WE TOGGLE showLookCenterHelp */}
            <div className={`guide-bubble guide-bubble-look-center ${showLookCenterHelp ? 'visible' : ''}`}>
                <p>Great job!  You can use the "Center View" button to look straight ahead anytime.</p>
            </div>

            {/* CROSS STREET #1 HELP: APPEARS ONCE THE USER HAS LOOKED CENTER, AND WE TOGGLE showCrossStree1Help */}
            <div className={`guide-bubble guide-bubble-cross-street-1 ${showCrossStreet1Help ? 'visible' : ''}`}>
                <p>Way to go.  You've looked both ways before crossing the street.  If you think it's safe to cross, go ahead and push that "Forward" button.</p>
            </div>

            {/* LOOK RIGHT #2 HELP: APPEARS WEHN THE PEDESTRIAN REACHES THE CENTER OF THE STREET COORDINATE, WE TOGGLE showLookRight2Help */}
            <div className={`guide-bubble guide-bubble-look-right-2 ${showLookRight2Help ? 'visible' : ''}`}>
                <p>You're halfway across the street! When crossing a street, it's a great idea to look both ways often.  Let's practice, this time by looking right first, since vehicles will be coming from the right this time.</p>
            </div>

            {/* CROSS STREET #2 HELP: APPEARS AFTER THE USER HAS LOOKED RIGHT AGAIN, WE TOGGLE showCrossStreet2Help */}
            <div className={`guide-bubble guide-bubble-cross-street-2 ${showCrossStreet2Help ? 'visible' : ''}`}>
                <p>Is the coast clear?  If so, let's keep on moving forward.</p>
            </div>
        </div>
    );
};

export default BeginnerGuide;