import React, { useState, useEffect } from 'react';
import Vehicle from '../Vehicle';
import FourWayStop from '../FourWayStop';

import './IntersectionLayout.css';
import TwoWayStop from '../TwoWayStop';

const IntersectionLayout = ({ intersectionType }) => {
  const [vehicles, setVehicles] = useState([]);

    // Define starting and ending positions for each lane
    const lanePositions = {
      eastbound: { startX: 0, startY: 150, endX: 500, endY: 150 },
      westbound: { startX: 500, startY: 200, endX: 0, endY: 200 },
    };
  
    // FUNCTION TO GENERATE A RANDOM VEHICLE //
    const generateRandomVehicle = () => {
      const types = ['car', 'small truck', 'motorcycle', 'big truck', 'bus'];
      const randomType = types[Math.floor(Math.random() * types.length)];
  
      const directions = ['eastbound', 'westbound'];
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];
  
      // Generate random speed
      const speed = Math.random() * 5 + 1; // RANDOM SPEED BETWEEN 1 AND 5 UNITS PER FRAME
  
      // Calculate starting position based on the lane
      const { startX, startY, endX, endY } = lanePositions[randomDirection];
      const position = { x: startX, y: startY };
  
      return {
        type: randomType,
        position: position,
        direction: randomDirection,
        speed: speed,
        path: { startX: startX, startY: startY, endX: endX, endY: endY },
        stopped: false,
      };
    };
  
    // FUCTION TO ADD A NEW VEHICLE TO THE INTERSECTION //
    const addVehicle = (vehicle) => {
      setVehicles(prevVehicles => [...prevVehicles, vehicle]);
    };
  
    useEffect(() => {
      // GENERATE RANDOM NUMBER OF VEHICLES //
      const numberOfVehicles = Math.floor(Math.random() * 10) + 1; // RANDOM BETWEEN 1 AND 10 //
      const initialVehicles = Array.from({ length: numberOfVehicles }, () => generateRandomVehicle());
      initialVehicles.forEach(vehicle => addVehicle(vehicle));
  
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intersectionType]);
  
    // UPDATE VEHICLE POSITION //
    useEffect(() => {
      const updateVehiclePosition = () => {
        setVehicles(prevVehicles => {
          return prevVehicles.map(vehicle => {
            if (!vehicle.stopped) {
              // Move vehicle along its path
              const dx = vehicle.path.endX - vehicle.path.startX;
              const dy = vehicle.path.endY - vehicle.path.startY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const ratio = vehicle.speed / distance;
              const newX = vehicle.position.x + ratio * dx;
              const newY = vehicle.position.y + ratio * dy;
  
              return { ...vehicle, position: { x: newX, y: newY } };
            } else {
              // Vehicle is stopped, no movement
              return vehicle;
            }
          });
        });
      };
  
      // Update vehicle positions at regular intervals
      const animationInterval = setInterval(() => {
        updateVehiclePosition();
      }, 1000 / 30); // 30 FRAMES PER SECOND
  
      return () => clearInterval(animationInterval);
  
    }, []);

  // useEffect(() => {
  //   // FUNCTION TO GENERATE A RANDOM VEHICLE //
  //   const generateRandomVehicle = () => {
  //     const types = ['car', 'small truck', 'motorcycle', 'big truck', 'bus'];
  //     const randomType = types[Math.floor(Math.random() * types.length)];

  //     const directions = ['north', 'south', 'east', 'west'];
  //     const randomDirection = directions[Math.floor(Math.random() * directions.length)];

  //     return {
  //       type: randomType,
  //       position: { x: Math.random() * 500, y: Math.random() * 300 }, // RANDOM POSITION WITHIN INTERSECTION //
  //       // position: position,
  //       direction: randomDirection,
  //       speed: Math.random() * 5 + 1, // RANDOM SPEED BETWEEN 1 AND 5 UNITS PER FRAME //
  //       stopped: false // INITIALLY NOT STOPPED //
  //     };
  //   };

  //   // FUCTION TO ADD A NEW VEHICLE TO THE INTERSECTION //
  //   const addVehicle = (vehicle) => {
  //     setVehicles(prevVehicles => [...prevVehicles, vehicle]);
  //   };

  //   // GENEREATE RANDOM NUMBER OF VEHICLES //
  //   const numberOfVehicles = Math.floor(Math.random() * 10) + 1; // RANDOM BETWEEN 1 AND 10 //
  //   const initialVehicles = Array.from({ length: numberOfVehicles }, () => generateRandomVehicle());
  //   // setVehicles(initialVehicles);

  //   // ADD THE INITIAL VEHICLES USING THE ADDVEHICLES FUNCTION //
  //   initialVehicles.forEach(vehicle => addVehicle(vehicle));
  // }, [intersectionType]);


  // // UPDATE VEHICLE POSITION //
  // useEffect(() => {
  //   const updateVehiclePosition = () => {
  //     setVehicles(prevVehicles => {
  //       return prevVehicles.map(vehicle => {
  //         if (!vehicle.stopped) {
  //           // MOVE VEHICLE BASED ON ITS SPEED AND DIRECTION //
  //           switch (vehicle.direction) {
  //             case 'north':
  //               return { ...vehicle, position: { ...vehicle.position, y: vehicle.position.y - vehicle.speed } };
  //             case 'south':
  //               return { ...vehicle, position: { ...vehicle.position, y: vehicle.position.y + vehicle.speed } };
  //             case 'east':
  //               return { ...vehicle, position: { ...vehicle.position, x: vehicle.position.x + vehicle.speed } };
  //             case 'west':
  //               return { ...vehicle, position: { ...vehicle.position, x: vehicle.position.x - vehicle.speed } };
  //             default:
  //               return vehicle;
  //           }
  //         } else {
  //           // VEHICLE IS STOPPED, NO MOVEMENT //
  //           return vehicle;
  //         }
  //       });
  //     });
  //   };

  //   // CHECK FOR COLLISIONS AND STOP AT INTERSECTION //
  //   const checkCollisionsAndIntersection = () => {
  //     setVehicles(prevVehicles => {
  //       return prevVehicles.map((vehicle, index) => {
  //         // CHECK IF VEHICLE IS AT INTERSECTION (STOP SIGN) //
  //         if (vehicle.position.x > 200 && vehicle.position.x < 300 && vehicle.position.y > 200 && vehicle.position.y < 300) {
  //           // STOP VEHICLE AT INTERSECTION //
  //           return { ...vehicle, stopped: true };
  //         }

  //         // CHECK FOR COLLISION WITH VEHICLES IN FRONT //
  //         const distanceToNextVehicle = prevVehicles.slice(index + 1).reduce((minDistance, nextVehicle) => {
  //           if (vehicle.direction === 'north' && nextVehicle.direction === 'south' && nextVehicle.position.y > vehicle.position.y && nextVehicle.position.y - vehicle.position.y < minDistance) {
  //             return nextVehicle.position.y - vehicle.position.y;
  //           } else if (vehicle.direction === 'south' && nextVehicle.direction === 'north' && vehicle.position.y > nextVehicle.position.y && vehicle.position.y - nextVehicle.position.y < minDistance) {
  //             return vehicle.position.y - nextVehicle.position.y;
  //           } else if (vehicle.direction === 'east' && nextVehicle.direction === 'west' && nextVehicle.position.x > vehicle.position.x && nextVehicle.position.x - vehicle.position.x < minDistance) {
  //             return nextVehicle.position.x - vehicle.position.x;
  //           } else if (vehicle.direction === 'west' && nextVehicle.direction === 'east' && nextVehicle.position.x > nextVehicle.position.x && vehicle.position.x - nextVehicle.position.x < minDistance) {
  //             return vehicle.position.x - nextVehicle.position.x;
  //           } else {
  //             return minDistance;
  //           }
  //         }, Infinity);

  //         if (distanceToNextVehicle < 50) {
  //           // STOP VEHICLE IF TOO CLOSE TO THE VEHICLE IN FRONT //
  //           return { ...vehicle, stopped: true };
  //         } else {
  //           // VEHICLE CAN CONTINUE MOVING //
  //           return { ...vehicle, stopped: false };
  //         }
  //       });
  //     });
  //   };

  //   // UPDATE VEHICLE POSITIONS AND CHECK FOR COLLISIONS AT REGULAR INTERVALS //
  //   const animationInterval = setInterval(() => {
  //     updateVehiclePosition();
  //     checkCollisionsAndIntersection();
  //   }, 1000 / 30); // 30 FRAMES PER SECOND //

  //   // CLEANUP FUNCTION TO CLEAR INTERVAL //
  //   return () => clearInterval(animationInterval);
  // }, []);



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
