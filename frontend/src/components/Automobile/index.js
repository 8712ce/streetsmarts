import React from 'react';
import './automobile.css';

const Automobile = ({ vehicle }) => {
    const maxZIndex = 1000;
    const maxY = 100;

    // CALCULATE Z-INDEX BASED ON Y POSITION //
    let zIndex = Math.floor((vehicle.currentPosition.y / maxY) * maxZIndex);

    // HANDLE EDGE CASES: ADD A SMALL OFFSET BASED ON VEHICLE ID //
    const idOffset = parseInt(vehicle._id, 36) % maxZIndex;
    zIndex = zIndex * maxZIndex + idOffset;

    return (
        <div
            className="automobile"
            style={{
                // position: 'absolute',
                left: `${vehicle.currentPosition.x}%`,
                top: `${vehicle.currentPosition.y}%`,
                // transform: 'translate(-50%, -75%)',
                zIndex: zIndex,
            }}
        >
            <img src={vehicle.image} alt={vehicle.type} className="vehicle-image" style={{ transform: 'translate(-50%, -75%)' }} />
        </div>
    );
};

export default Automobile;
