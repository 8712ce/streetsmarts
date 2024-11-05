import React from 'react';
import './automobile.css';

const Automobile = ({ vehicle }) => {
    // const containerWidth = 3628; // WIDTH OF BACKGROUND IMAGE //
    // const containerHeight = 1000; // HEIGHT OF BACKGROUND IMAGE //

    return (
        <div
            className="automobile"
            style={{
                // position: 'absolute',
                left: `${vehicle.currentPosition.x}%`,
                top: `${vehicle.currentPosition.y}%`,
                transform: 'translate(-50%, -75%)',
            }}
        >
            <img src={vehicle.image} alt={vehicle.type} className="vehicle-image" />
        </div>
    );
};

export default Automobile;
