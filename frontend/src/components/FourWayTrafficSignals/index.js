import React from "react";
import SimulationContainer from "../SimulationContainer";

function FourWayTrafficSignals() {
    return (
        <SimulationContainer backgroundImage="bg_4way_signs.jpg" simulationType="trafficSignal">
            {/* SIMULATION-SPECIFIC CONTROLS OR INDICATORS FOR TRAFFIC SIGNALS */}
        </SimulationContainer>
    );
}

export default FourWayTrafficSignals;