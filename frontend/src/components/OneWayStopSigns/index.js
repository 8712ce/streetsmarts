import React from 'react';
import Vehicle from './Vehicle';
import './OneWayStopSigns.css';

const OneWayStopSigns = ({ intersection, vehicles }) => {
  return (
    <div className="intersection">
      {/* Display intersection layout */}
      <div className="intersection-layout">
        {/* Your intersection layout UI components here */}
      </div>

      {/* Display cars */}
      {vehicles.map((vehicle, index) => (
        <Vehicle key={index} position={vehicle.position} direction={vehicle.direction} />
      ))}
    </div>
  );
}

export default OneWayStopSigns;
