import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create a context for the Traffic Controller
const TrafficControllerContext = createContext();

export const useTrafficController = () => {
    const context = useContext(TrafficControllerContext);
    if (!context) {
        throw new Error('useTrafficController must be used within a TrafficControllerProvider');
    }
    // console.log('useTrafficController called, context:', context);
    return context;
  };

const TrafficControllerProvider = ({ children }) => {
    const [vehicles, setVehicles] = useState([]); // State to keep track of all vehicles
    const [occupiedCoordinates, setOccupiedCoordinates] = useState({}); // State to keep track of occupied coordinates

    // Function to register a new vehicle
    const registerVehicle = (vehicle) => {
        const initialPosition = vehicle.path && vehicle.path[0] ? vehicle.path[0] : { x: 0, y: 0 };
        vehicle.position = initialPosition;

        console.log('Registering new vehicle:', vehicle);
        
        setVehicles((prevVehicles) => {
            console.log('Previous vehicles in context:', prevVehicles);
            const updatedVehicles = [...prevVehicles, vehicle];
            console.log('Updated vehicles in context:', updatedVehicles);
            return updatedVehicles;
          });

        setOccupiedCoordinates((prev) => ({
            ...prev,
            [`${initialPosition.x},${initialPosition.y}`]: vehicle._id, // Mark the initial position as occupied
        }));
    };

    // Function to request a vehicle move
    const requestMove = useCallback((vehicleId, newPosition) => {
        const newPositionKey = `${newPosition.x},${newPosition.y}`;
        console.log(`Requesting move for vehicle ${vehicleId} to position (${newPosition.x}, ${newPosition.y})`);

        setVehicles((prevVehicles) => {
            console.log('Current vehicles in context (before move):', prevVehicles);
            const vehicleIndex = prevVehicles.findIndex(vehicle => vehicle._id === vehicleId);
            if (vehicleIndex === -1) {
                console.log(`Vehicle ${vehicleId} not found in vehicles array`);
                return prevVehicles;
            }

            const vehicle = prevVehicles[vehicleIndex];
            const prevPositionKey = `${vehicle.position.x},${vehicle.position.y}`;

            console.log(`Current occupied coordinates: ${JSON.stringify(occupiedCoordinates)}`);
            if (occupiedCoordinates[newPositionKey]) {
                console.log(`Move denied for vehicle ${vehicleId} to position (${newPosition.x}, ${newPosition.y}) - Position already occupied`);
                return prevVehicles;
            }

            // Move is allowed
            console.log(`Move granted for vehicle ${vehicleId} to position (${newPosition.x}, ${newPosition.y})`);

            const updatedVehicles = [...prevVehicles];
            updatedVehicles[vehicleIndex] = { ...vehicle, position: newPosition };
            console.log('Updated vehicles after move:', updatedVehicles);

            setOccupiedCoordinates(prev => {
                const updated = { ...prev };
                delete updated[prevPositionKey]; // Free up the previous position
                updated[newPositionKey] = vehicleId; // Occupy the new position
                console.log(`Updated occupied coordinates: ${JSON.stringify(updated)}`);
                return updated;
            });

            return updatedVehicles;
        });

        return !occupiedCoordinates[newPositionKey];
    }, [occupiedCoordinates]);

    // Function to deregister (remove) a vehicle
    const deregisterVehicle = useCallback((vehicleId) => {
        setVehicles((prevVehicles) => {
            const vehicleIndex = prevVehicles.findIndex(vehicle => vehicle._id === vehicleId);
            if (vehicleIndex === -1) {
                console.log(`Vehicle ${vehicleId} not found in vehicles array`);
                return prevVehicles;
            }

            const vehicle = prevVehicles[vehicleIndex];
            const finalPositionKey = `${vehicle.position.x},${vehicle.position.y}`;

            setOccupiedCoordinates((prev) => {
                const updated = { ...prev };
                delete updated[finalPositionKey]; // Free up the final position
                console.log(`Updated occupied coordinates after deregistration: ${JSON.stringify(updated)}`);
                return updated;
            });

            console.log(`Vehicle deregistered: ${vehicleId}`);

            return prevVehicles.filter(v => v._id !== vehicleId); // Remove the vehicle from the vehicles array
        });
        console.log(`Automobile deleted: ${vehicleId}`);
    }, []);

    return (
        <TrafficControllerContext.Provider value={{ vehicles, registerVehicle, requestMove, deregisterVehicle }}>
            {children}
        </TrafficControllerContext.Provider>
    );
};

export default TrafficControllerProvider;
