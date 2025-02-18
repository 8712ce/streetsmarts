import React from "react";
import SimulationContainer from "../SimulationContainer";
import { useLocation } from "react-router-dom";

function FourWayStopSigns() {

    const location = useLocation();

    const { difficulty = 'expert', adventureLabel = 'Bank', simulationType = 'stopSign' } = location.state || {};

    return (
        <SimulationContainer
            backgroundImage="bg_4way_signs.jpg"
            // simulationType="stopSign"
            simulationType={simulationType}
            difficulty={difficulty}
            adventureLabel={adventureLabel}
        />
    );
}

export default FourWayStopSigns;