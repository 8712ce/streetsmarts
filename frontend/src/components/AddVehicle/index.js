import React from "react";

const AddVehicle = () => {

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
        // setVehicles(initialVehicles);
    
        // ADD TEH INITIAL VEHICLES USING THE ADDVEHICLES FUNCTION //
        initialVehicles.forEach(vehicle => addVehicle(vehicle));
      }, [intersectionType, addVehicle]);
}

export default AddVehicle;