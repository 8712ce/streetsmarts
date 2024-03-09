// DEPENDENCIES //
import React, { useState, useEffect } from "react";
import "./FourWayStopSign.css";



const StopSigns = () => {
    const minSafeDistance = 30;
    const intersectionWidth = 600;
    const intersectionHeight = 600;

    // Define state variables to track vehicles and their positions. //
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const generateRandomVehicles = () => {
            const newVehicles = [];

            // Define vehicle types with thier probability. //
            const vehicleTypes = [
                { type: "car", probability: 0.3 },
                { type: "smallTruck", probability: 0.3 },
                { type: "bus", probability: 0.1 },
                { type: "motorcycle", probability: 0.1 },
                { type: "bigTruck", probability: 0.2 }
            ];

            // Generate vehicles from north, south, east, and west directions. //
            const directions = ["north", "south", "east", "west"];
            directions.forEach(direction => {
                const numVehicles = Math.floor(Math.random() * 6); // Random number of vehicles (0 to 5) //
                for (let i = 0; i < numVehicles; i++) {
                    // Randomly select vehicle type based on weighted probability distribution //
                    const rand = Math.random();
                    let cumulativeProbability = 0;
                    let selectedType;
                    for (const { type, probability } of vehicleTypes) {
                        cumulativeProbability += probability;
                        if (rand <= cumulativeProbability) {
                            selectedType = type;
                            break;
                        }
                    }

                    // Assign a random wait time for each vehicle. //
                    const waitTime = Math.floor(Math.random() * 6000); // Random wait time (0 to 5 seconds).

                    const vehicle = {
                        id: `${direction}-${i}`,
                        type: selectedType,
                        direction: direction,
                        stopped: true,
                        waitTime: waitTime
                    };
                    newVehicles.push(vehicle);
                }
            });

            setVehicles(newVehicles);
        };

        // Generate vehicles initially. //
        generateRandomVehicles();

        // Function to handle vehicle movement. //
        const moveVehicles = () => {
            const updatedVehicles = vehicles.map(vehicle => {
                // If vehicle is stopped, decrement wait time. //
                if (vehicle.stopped) {
                    vehicle.waitTime -= 1000; // Decrease wait time by 1 second.
                    // If wait time is 0, allow the vehicle to proceed. //
                    if (vehicle.waitTime <= 0) {
                        vehicle.stopped = false;
                        // Randomly determine the direction after stopping. //
                        const directions = ["straight", "left", "right"];
                        vehicle.directionAfterStop = directions[Math.floor(Math.random() * directions.length)];
                    }
                }
                return vehicle;
            });
            setVehicles(updatedVehicles);
        };

        // Set interval to move vehicles. //
        const interval = setInterval(moveVehicles, 1000); // Move vehicles every second.

        // Clean up function to clear interval. //
        return () => clearInterval;
    }, []); // Run effect only once on component mount.

    const updateVehiclePositions = () => {
        const updatedVehicles = vehicles.map(vehicle => {
            // Update vehilce position based on its direction and speed. //
            let newX = vehicle.x + vehicle.speedX;
            let newY = vehicle.y + vehicle.speedY;

            // Check for collision with other vehicles. //
            const collidesWithOtherVehicle = vehicles.some(otherVehicle => {
                if (otherVehicle.id !== vehicle.id) {
                    // Calculate distance between vehicles. //
                    const distance = Math.sqrt(Math.pow(newX - otherVehicle.x, 2) + Math.pow(newY - otherVehicle.y, 2));
                    // If distance is less than a minimum safe distance, collision occurs. //
                    if (distance < minSafeDistance) {
                        return true;
                    }
                }
                return false;
            });

            // Check for collision with intersection boundaries. //
            const collidesWithIntersectionBoundary = newX < 0 || newX > intersectionWidth || newY < 0 || newY > intersectionHeight;

            // If collision occurs, stop the vehicle. //
            if (collidesWithOtherVehicle || collidesWithIntersectionBoundary) {
                // Stop the vehicle. //
                vehicle.speedX = 0;
                vehicle.speedY = 0;
            } else {
                // Continue vehicle movement. //
                vehicle.x = newX;
                vehicle.y = newY;
            }

            return vehicle;
        });
    }



    return (
        <div className="intersection">
            {/* Render vehicles */}
            {vehicles.map(vehicle => (
                <div key={vehicle.id} className={`vehicle ${vehicle.stopped ? 'stopped' : "moving"} ${vehicle.direction} ${vehicle.type}`} style={{ top: vehicle.y, left: vehicle.x }}></div>
            ))}
            
            {/* Render stop signs at each corner of the intersection */}
            <div className="stop-sign-north"></div>
            <div className="stop-sign-south"></div>
            <div className="stop-sign-east"></div>
            <div className="stop-sign-west"></div>

            {/* Render streets */}
            <div className="streets">
                {/* Define your streets layout here using divs or other HTML elements */}
            </div>
        </div>
    );
};

export default StopSigns;