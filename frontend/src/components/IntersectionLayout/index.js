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
        direction: randomDirection,
        speed: Math.random() * 5 + 1, // RANDOM SPEED BETWEEN 1 AND 5 UNITS PER FRAME //
        stopped: false // INITIALLY NOT STOPPED //
      };
    };

    // GENEREATE RANDOM NUMBER OF VEHICLES //
    const numberOfVehicles = Math.floor(Math.random() * 10) + 1; // RANDOM BETWEEN 1 AND 10 //
    const initialVehicles = Array.from({ length: numberOfVehicles }, () => generateRandomVehicle());
    setVehicles(initialVehicles);
  }, [intersectionType]);


  // UPDATE VEHICLE POSITION //
  useEffect(() => {
    const updateVehiclePosition = () => {
      setVehicles(prevVehicles => {
        return prevVehicles.map(vehicle => {
          if (!vehicle.stopped) {
            // MOVE VEHICLE BASED ON ITS SPEED AND DIRECTION //
            switch (vehicle.direction) {
              case 'north':
                return { ...vehicle, position: { ...vehicle.position, y: vehicle.position.y - vehicle.speed } };
              case 'south':
                return { ...vehicle, position: { ...vehicle.position, y: vehicle.position.y + vehicle.speed } };
              case 'east':
                return { ...vehicle, position: { ...vehicle.position, x: vehicle.position.x + vehicle.speed } };
              case 'west':
                return { ...vehicle, position: { ...vehicle.position, x: vehicle.position.x - vehicle.speed } };
              default:
                return vehicle;
            }
          } else {
            // VEHICLE IS STOPPED, NO MOVEMENT //
            return vehicle;
          }
        });
      });
    };

    // CHECK FOR COLLISIONS AND STOP AT INTERSECTION //
    const checkCollisionsAndIntersection = () => {
      setVehicles(prevVehicles => {
        return prevVehicles.map((vehicle, index) => {
          // CHECK IF VEHICLE IS AT INTERSECTION (STOP SIGN) //
          if (vehicle.position.x > 200 && vehicle.position.x < 300 && vehicle.position.y > 200 && vehicle.position.y < 300) {
            // STOP VEHICLE AT INTERSECTION //
            return { ...vehicle, stopped: true };
          }

          // CHECK FOR COLLISION WITH VEHICLES IN FRONT //
          const distanceToNextVehicle = prevVehicles.slice(index + 1).reduce((minDistance, nextVehicle) => {
            if (vehicle.direction === 'north' && nextVehicle.direction === 'south' && nextVehicle.position.y > vehicle.position.y && nextVehicle.position.y - vehicle.position.y < minDistance) {
              return nextVehicle.position.y - vehicle.position.y;
            } else if (vehicle.direction === 'south' && nextVehicle.direction === 'north' && vehicle.position.y > nextVehicle.position.y && vehicle.position.y - nextVehicle.position.y < minDistance) {
              return vehicle.position.y - nextVehicle.position.y;
            } else if (vehicle.direction === 'east' && nextVehicle.direction === 'west' && nextVehicle.position.x > vehicle.position.x && nextVehicle.position.x - vehicle.position.x < minDistance) {
              return nextVehicle.position.x - vehicle.position.x;
            } else if (vehicle.direction === 'west' && nextVehicle.direction === 'east' && nextVehicle.position.x > nextVehicle.position.x && vehicle.position.x - nextVehicle.position.x < minDistance) {
              return vehicle.position.x - nextVehicle.position.x;
            } else {
              return minDistance;
            }
          }, Infinity);

          if (distanceToNextVehicle < 50) {
            // STOP VEHICLE IF TOO CLOSE TO THE VEHICLE IN FRONT //
            return { ...vehicle, stopped: true };
          } else {
            // VEHICLE CAN CONTINUE MOVING //
            return { ...vehicle, stopped: false };
          }
        });
      });
    };

    // UPDATE VEHICLE POSITIONS AND CHECK FOR COLLISIONS AT REGULAR INTERVALS //
    const animationInterval = setInterval(() => {
      updateVehiclePosition();
      checkCollisionsAndIntersection();
    }, 1000 / 30); // 30 FRAMES PER SECOND //

    // CLEANUP FUNCTION TO CLEAR INTERVAL //
    return () => clearInterval(animationInterval);
  }, []);



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
