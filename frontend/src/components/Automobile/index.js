import React, { useEffect, useState } from 'react';
import './automobile.css';

const Automobile = ({ vehicle }) => {
    return (
        <div className="automobile" style={{ transform: `translate(${automobilePosition.x}px, ${automobilePosition.y}px)` }}>
            {vehicle && <img src={vehicle.image} alt={vehicle.type} className="vehicle-image" />}
        </div>
    );
};

export default Automobile;
