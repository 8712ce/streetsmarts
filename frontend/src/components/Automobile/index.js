import React from 'react';
import './automobile.css';

const Automobile = ({ vehicle }) => {
    return (
        <div
            className="automobile"
            style={{
                position: 'absolute',
                left: `${vehicle.currentPosition.x}%`,
                top: `${vehicle.currentPosition.y}%`,
                transform: 'translate(-50%, -100%)',
            }}
        >
            <img src={vehicle.image} alt={vehicle.type} className="vehicle-image" />
        </div>
    );
};

export default Automobile;
