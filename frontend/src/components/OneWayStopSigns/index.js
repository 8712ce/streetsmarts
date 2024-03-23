import React from 'react';
import Car from './Car';
import './OneWayStopSigns.css';

const OneWayStopSigns = ({ intersection, cars }) => {
  return (
    <div className="intersection">
      {/* Display intersection layout */}
      <div className="intersection-layout">
        {/* Your intersection layout UI components here */}
      </div>

      {/* Display cars */}
      {cars.map((car, index) => (
        <Car key={index} position={car.position} direction={car.direction} />
      ))}
    </div>
  );
}

export default OneWayStopSigns;
