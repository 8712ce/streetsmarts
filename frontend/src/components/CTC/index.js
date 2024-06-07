import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create a context for the Traffic Controller
const TrafficControllerContext = createContext();

export const useTrafficController = () => useContext(TrafficControllerContext);

const TrafficControllerProvider = ({ children }) => {
    const [vehicles, setVehicles] = useState([]);
    const [occupiedCoordinates, setOccupiedCoordinates] = useState({});

    const registerVehicle = (vehicle) => {
        const initialPosition = vehicle.path && vehicle.path[0] ? vehicle.path[0] : { x: 0, y: 0 };
        vehicle.position = initialPosition;

        setVehicles((prevVehicles) => [...prevVehicles, vehicle]);
        setOccupiedCoordinates((prev) => ({
            ...prev,
            [`${initialPosition.x},${initialPosition.y}`]: vehicle._id,
        }));
    };

    const requestMove = useCallback((vehicleId, newPosition) => {
        const newPositionKey = `${newPosition.x},${newPosition.y}`;
        console.log(`Requesting move for vehicle ${vehicleId} to position (${newPosition.x}, ${newPosition.y})`);

        setVehicles((prevVehicles) => {
            const vehicleIndex = prevVehicles.findIndex(vehicle => vehicle._id === vehicleId);
            if (vehicleIndex === -1) return prevVehicles;

            const vehicle = prevVehicles[vehicleIndex];
            const prevPositionKey = `${vehicle.position.x},${vehicle.position.y}`;

            if (occupiedCoordinates[newPositionKey]) {
                console.log(`Move denied for vehicle ${vehicleId} to position (${newPosition.x}, ${newPosition.y})`);
                return prevVehicles;
            }

            // Move is allowed
            const updatedVehicles = [...prevVehicles];
            updatedVehicles[vehicleIndex] = { ...vehicle, position: newPosition };

            setOccupiedCoordinates(prev => {
                const updated = { ...prev };
                delete updated[prevPositionKey]; // Free up the previous position
                updated[newPositionKey] = vehicleId; // Occupy the new position
                return updated;
            });

            console.log(`Move granted for vehicle ${vehicleId} to position (${newPosition.x}, ${newPosition.y})`);
            return updatedVehicles;
        });

        return !occupiedCoordinates[newPositionKey];
    }, [occupiedCoordinates]);

    const deregisterVehicle = useCallback((vehicleId) => {
        setVehicles((prevVehicles) => {
            const vehicleIndex = prevVehicles.findIndex(vehicle => vehicle._id === vehicleId);
            if (vehicleIndex === -1) return prevVehicles;

            const vehicle = prevVehicles[vehicleIndex];
            const finalPositionKey = `${vehicle.position.x},${vehicle.position.y}`;

            setOccupiedCoordinates((prev) => {
                const updated = { ...prev };
                delete updated[finalPositionKey]; // Free up the final position
                return updated;
            });

            return prevVehicles.filter(v => v._id !== vehicleId);
        });
        console.log(`Automobile deleted: ${vehicleId}`);
    }, []);

    return (
        <TrafficControllerContext.Provider value={{ registerVehicle, requestMove, deregisterVehicle }}>
            {children}
        </TrafficControllerContext.Provider>
    );
};

export default TrafficControllerProvider;