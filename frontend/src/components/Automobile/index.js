import React from 'react';
import './automobile.css';

const Automobile = ({ vehicle }) => {
    const containerWidth = 3000; // WIDTH OF BACKGROUND IMAGE //
    const containerHeight = 1000; // HEIGHT OF BACKGROUND IMAGE //

    return (
        <div
            className="automobile"
            style={{
                // position: 'absolute',
                left: `${(vehicle.currentPosition.x / 100) * containerWidth}px`,
                top: `${(vehicle.currentPosition.y / 100) * containerHeight}px`,
                transform: 'translate(-50%, -100%)',
            }}
        >
            <img src={vehicle.image} alt={vehicle.type} className="vehicle-image" />
        </div>
    );
};

export default Automobile;
