import React from "react";
import './trafficLight.css';

function TrafficLight({ position, state }) {
    return (
        <div className={`traffic-light ${position}`}>
            <div className={`light red ${state === 'red' ? 'on' : ''}`}></div>
            <div className={`light yellow ${state === 'yellow' ? 'on' : ''}`}></div>
            <div className={`light green ${state === 'green' ? 'on' : ''}`}></div>
        </div>
    );
}

export default TrafficLight;