import React from "react";
import SimulationContainer from "../SimulationContainer";
import { useLocation } from "react-router-dom";

function FourWayTrafficSignals() {

    const location = useLocation();
    // const difficulty = location.state?.difficulty || 'expert';
    const { difficulty = 'expert' } = location.state || {};

    return (
        <SimulationContainer backgroundImage="bg_4way_signs.jpg" simulationType="trafficSignal" difficulty={difficulty}>
            {/* SIMULATION-SPECIFIC CONTROLS OR INDICATORS FOR TRAFFIC SIGNALS */}
        </SimulationContainer>
    );
}

export default FourWayTrafficSignals;