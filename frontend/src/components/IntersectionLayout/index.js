import React, { useState, useEffect } from 'react';
import Vehicle from './Vehicle';
import FourWayStop from '../FourWayStop';

import './IntersectionLayout.css';
import TwoWayStop from '../TwoWayStop';

const IntersectionLayout = ({ intersectionType }) => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // FUNCTION TO GENERATE A RANDOM VEHICLE //
    const generateRandomVehicle = () => {
      const types = ['car', 'small truck', 'motorcycle', 'big truck', 'bus'];
      const randomType = types[Math.floor(Math.random() * types.length)];

      const directions = ['north', 'south', 'east', 'west'];
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];

      return {
        type: randomType,
        position: { x: Math.random() * 500, y: Math.random() * 300 }, // RANDOM POSITION WITHIN INTERSECTION //
        direction: randomDirection
      };
    };

    // GENEREATE RANDOM NUMBER OF VEHICLES //
    const numberOfVehicles = Math.floor(Math.random() * 10) + 1; // RANDOM BETWEEN 1 AND 10 //
    const initialVehicles = Array.from({ length: numberOfVehicles }, () => generateRandomVehicle());
    setVehicles(initialVehicles);
  }, [intersectionType]);



  return (
    <div className="intersection">
      {/* RENDER APPROPRIATE INTERSECTION COMPONENT BASED ON INTERSECTION TYPE */}
      {intersectionType === 'four-way-stop' && <FourWayStop />}
      {intersectionType === 'two-way-stop' && <TwoWayStop />}

      {/* DISPLAY VEHICLES */}
      {vehicles.map((vehicle, index) => (
        <Vehicle key={index} position={vehicle.position} direction={vehicle.direction} />
      ))}
    </div>
  );
}

export default IntersectionLayout;
