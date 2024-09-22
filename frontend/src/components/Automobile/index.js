import React from 'react';
import './automobile.css';

const Automobile = ({ vehicle }) => {
    return (
        <div className="automobile" style={{ transform: `translate(${vehicle.currentPosition.x}px, ${vehicle.currentPosition.y}px)` }}>
            {vehicle && <img src={vehicle.image} alt={vehicle.type} className="vehicle-image" />}
        </div>
    );
};

export default Automobile;
