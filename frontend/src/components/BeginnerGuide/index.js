import React from "react";
import './beginnerGuide.css';

function BeginnerGuide({ tutorialStep }) {

    const showMoveHelp = (tutorialStep === 1);
    const showLookLeftHelp = (tutorialStep === 2);
    const showLookRight1Help = (tutorialStep === 3);
    const showLookCenterHelp = (tutorialStep === 4);
    const showCrossStreet1Help = (tutorialStep === 5);
    const showLookRight2Help = (tutorialStep === 6);
    const showCrossStreet2Help = (tutorialStep === 7);

    return (
        <div className="beginner-guide-container">

            {/* TUTORIAL STEP 1: AUTOMATICALLY HAPPENS WHEN PAGE FIRST LOADS.  ALL 3 LOOK BUTTONS SHOULD BE DISABLED. THE FOLLOWING BUBBLE POPS UP */}
            {/* MOVE HELP BUBBLE */}
            <div className={`guide-bubble guide-bubble-move ${showMoveHelp ? 'visible' : ''}`}>
                <p>Use these buttons to move your player forward or backward.</p>
            </div>

            
            {/* TUTORIAL STEP 2: THE PEDESTRIAN HAS PREVIOUSLY CLICKED THE "MOVE FORWARD" BUTTON AND IS NOW STADING ON THE STREET CORNER.  ALL BUTTONS EXCEPT FOR THE "LOOK LEFT" BUTTON SHOULD NOW BE MADE DISABLED. THE FOLLOWING BUBBLE POPS UP */}
            <div className={`guide-bubble guide-bubble-look ${showLookLeftHelp ? 'visible' : ''}`}>
                <p>You are now standing at the corner of an intersection.  In order to cross safely, it's essential to look left and right to see if vehicles are approaching.  You'll earn points!  Let's start by looking left.</p>
            </div>

            {/* TUTORIAL STEP 3: THE PEDESTRIAN HAS PREVIOUSLY CLICKED THE "LOOK LEFT" BUTTON.  ALL BUTTONS EXCEPT FOR THE "LOOK RIGHT" BUTTON SHOULD NOW BE MADE DISABLED. THE FOLLOWING BUBBLE POPS UP */}
            {/* LOOK RIGHT HELP #1: APPEARS AFTER THE USER HAS LOOKED LEFT AND WE TOGGLE showLookRight1Help */}
            <div className={`guide-bubble guide-bubble-look-right-1 ${showLookRight1Help ? 'visible' : ''}`}>
                <p>Great.  Now use the "Look Right" button to look right.</p>
            </div>

            {/* TUTORIAL STEP 4: THE PEDESTRIAN HAS PREVIOUSLY CLICKED THE "LOOK RIGHT" BUTTON.  ALL BUTTONS EXCEPT FOR THE "CENTER VIEW" BUTTON SHOULD NOW BE MADE DISABLED. THE FOLLOWING BUBBLE POPS UP */}
            {/* LOOK CENTER HELP: APPEARS AFTER THE USER HAS LOOKED BOTH WAYS AND WE TOGGLE showLookCenterHelp */}
            <div className={`guide-bubble guide-bubble-look-center ${showLookCenterHelp ? 'visible' : ''}`}>
                <p>Great job!  You can use the "Center View" button to look straight ahead anytime.</p>
            </div>

            {/* TUTORIAL STEP 5: THE PEDESTRIAN HAS PREVIOUSLY CLICKED THE "CENTER VIEW" BUTTON AND IS STILL AT THE STREET CORNER.  ALL BUTTONS SHOULD NOW BE ENABLED. THE FOLLOWING BUBBLE POPS UP */}
            {/* CROSS STREET #1 HELP: APPEARS ONCE THE USER HAS LOOKED CENTER, AND WE TOGGLE showCrossStree1Help */}
            <div className={`guide-bubble guide-bubble-cross-street-1 ${showCrossStreet1Help ? 'visible' : ''}`}>
                <p>Way to go.  You've looked both ways before crossing the street.  If you think it's safe to cross, go ahead and push that "Forward" button.</p>
            </div>

            {/* TUTORIAL STEP 6: THE PEDESTRIAN HAS PREVIOUSLY CLICKED THE "MOVE FORWARD" BUTTON UNTIL THEY ARE STANDING ON THE CENTER LINE (DIVIDING THE STREET.  A IO.TO EVENT WILL BE SENT FROM THE BACKEND AND RECEIVED BY THE FRONT.). ONLY THE "LOOK RIGHT" AND "LOOK LEFT" BUTTONS SHOULD BE ENABLED AT THIS TIME.  THE FOLLOWING BUBBLE POPS UP */}
            {/* LOOK RIGHT #2 HELP: APPEARS WEHN THE PEDESTRIAN REACHES THE CENTER OF THE STREET COORDINATE, WE TOGGLE showLookRight2Help */}
            <div className={`guide-bubble guide-bubble-look-right-2 ${showLookRight2Help ? 'visible' : ''}`}>
                <p>You're halfway across the street! When crossing a street, it's a great idea to look often.  Let's practice, this time by looking right first, since vehicles will be coming from the right this time.</p>
            </div>

            {/* TUTORIAL STEP 7: THE PEDESTRIAN HAS PREVIOUSLY CLICKED THE "LOOK RIGHT" BUTTON. ONCE THE "LOOK RIGHT" BUTTON HAS BEEN CLICKED, ALL BUTTONS SHOULD BE ENABLED.  THE FOLLOWING BUBBLE POPS UP */}
            {/* CROSS STREET #2 HELP: APPEARS AFTER THE USER HAS LOOKED RIGHT AGAIN, WE TOGGLE showCrossStreet2Help */}
            <div className={`guide-bubble guide-bubble-cross-street-2 ${showCrossStreet2Help ? 'visible' : ''}`}>
                <p>Is the coast clear?  If so, let's keep on moving forward.</p>
            </div>
        </div>
    );
};

export default BeginnerGuide;