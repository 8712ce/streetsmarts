import React from 'react';
import './automobile.css';
import { calculateZIndex } from '../../utils/zIndexUtils';

const Automobile = ({ vehicle }) => {
    const zIndex = calculateZIndex(vehicle.currentPosition.y, vehicle._id);

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
            <img
                src={vehicle.image}
                alt={vehicle.type}
                className="vehicle-image"
                style={{ transform: 'translate(-50%, -75%)' }}
            />
        </div>
    );
};

export default Automobile;
