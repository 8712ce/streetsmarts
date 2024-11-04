import React from 'react';
import './automobile.css';

// FUNCTION TO CALCULATE THE SCALED POSITION BASED ON CONTAINER DIMENSIONS //
const calculateScaledPosition = (positionX, positionY, containerWidth, containerHeight) => {
    return {
        x: (positionX / 100) * containerWidth,
        y: (positionY / 100) * containerHeight,
    };
};

const Automobile = ({ vehicle, containerWidth, containerHeight }) => {
    const { x, y } = calculateScaledPosition(vehicle.currentPosition.x, vehicle.currentPosition.y, containerWidth, containerHeight);

    return (
        <div className="automobile" style={{ position: 'absolute', transform: `translate(${x}px, ${y}px)` }}>
            {vehicle && <img src={vehicle.image} alt={vehicle.type} className="vehicle-image" />}
        </div>
    );
};

export default Automobile;
