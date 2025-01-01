import React from "react";
import SimulationContainer from "../SimulationContainer";
import { useLocation } from "react-router-dom";

function FourWayStopSigns() {

    const location = useLocation();
    // const difficulty = location.state?.difficulty || 'expert';
    const { difficulty = 'expert' } = location.state || {};

    return (
        <SimulationContainer backgroundImage="bg_4way_signs.jpg" simulationType="stopSign" difficulty={difficulty}>
            {/* Simulation-specific controls or indicators */}
        </SimulationContainer>
    );
}

export default FourWayStopSigns;