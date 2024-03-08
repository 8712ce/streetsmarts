// DEPENDENCIES //
// import React from "react";
// import { Link } from "react-router-dom";
import React, { useState } from "react";

// IMAGES //



// STYLES //
// import "./4WayIntStyles.css";







const FourWaySignals = ({ intersectionType }) => {
    // Define state variables to track player position and state //
    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
    const [playerState, setPlayerState] = useState("waiting"); // "waiting," "crossing," etc. //

    // Function to handle player movement //
    const movePlayer = (x, y) => {
        // Check if the movement is valid (eg: within intersection bouns, safe to move) //
        // This function should include logic to determine whether the player can move based on intersection state (eg: traffic lights, stop signs) //
        // If movement is valid, update player position //
        setPlayerPosition({ x, y });
    };

    const handleCross = () => {
        if (playerState === "waiting") {
            // Check if it's safe for the player to cross. //
            // Update player state to "crossing" if safe, else provide feedback to the user. //
            setPlayerState("crossing");
        }
    };

    return (
        <div className="intersection">
            {/* Render intersection layout based on the intersectionType */}
            {/* Example: <TrafficLights /> or <StopSigns /> based on intersectionType */}

            {/* Render controls at current position */}
            <div className="player" style={{ left: playerPosition.x, top: playerPosition.y }}></div>

            {/* Render controls for the player */}
            <div className="controls">
                <button onClick={handleCross} disabled={playerState !== "waiting"}>
                    Cross the Street
                </button>
            </div>
        </div>
    );
};

export default FourWaySignals;







// export default function Chapters() {
//     return (
//         <div>

           

//         </div>
//     )
// }