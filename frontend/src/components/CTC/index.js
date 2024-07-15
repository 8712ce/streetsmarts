import { createContext, useContext, useState, useCallback } from 'react';

// Create a context for the Traffic Controller
const TrafficControllerContext = createContext();

export const useTrafficController = () => {
    const context = useContext(TrafficControllerContext);
    if (!context) {
        throw new Error('useTrafficController must be used within a TrafficControllerProvider');
    }
    return context;
};

const TrafficControllerProvider = ({ children }) => {
    const [occupiedCoordinates, setOccupiedCoordinates] = useState({});

    const registerVehicle = (vehicle) => {
        const initialPosition = vehicle.path && vehicle.path[0] ? vehicle.path[0] : { x: 0, y: 0 };
        vehicle.position = initialPosition;
        const positionKey = `${initialPosition.x},${initialPosition.y}`;

        setOccupiedCoordinates((prev) => ({
            ...prev,
            [positionKey]: vehicle._id,
        }));
    };

    const requestMove = useCallback((vehicleId, newPosition) => {
        const newPositionKey = `${newPosition.x},${newPosition.y}`;

        // LOG THE VEHICLE ID AND THE REQUESTED NEW POSITION //
        console.log(`Vehicle ${vehicleId} requesting move to (${newPosition.x}, ${newPosition.y})`);

        // LOG THE CURRENT STATE OF OCCUPIED COORDINATES BEFORE THE MOVE //
        console.log('Current occupied coordinates:', occupiedCoordinates);

        if (occupiedCoordinates[newPositionKey]) {
            console.log(`Move denied for vehicle ${vehicleId} to position (${newPosition.x}, ${newPosition.y}) - Position already occupied`);
            return false;
        }

        setOccupiedCoordinates((prev) => {
            const updated = { ...prev };

            // LOG THE STATE BEFORE DELETING THE PREVIOUS POSITION //
            console.log(`Occupied coordinates before removing previous position for vehicle ${vehicleId}:`, updated);

            for (const [key, value] of Object.entries(updated)) {
                if (value === vehicleId) {
                    delete updated[key];
                }
            }

            // LOG THE STATE AFTER DELETING THE PREVIOUS POSITION //
            console.log(`Occupied coordinates after removing previous position for vehicle ${vehicleId}:`, updated);

            updated[newPositionKey] = vehicleId;

            // LOG THE UPDATED STATE OF OCCUPIED COORDINATES AFTER THE MOVE //
            console.log(`Occupied coordinates after move for vehicle ${vehicleId}:`, updated);

            return updated;
        });

        console.log(`Move granted for vehicle ${vehicleId} to position (${newPosition.x}, ${newPosition.y})`);
        return true;
    }, [occupiedCoordinates]);

    const deregisterVehicle = useCallback((vehicleId) => {
        setOccupiedCoordinates((prev) => {
            const updated = { ...prev };

            for (const [key, value] of Object.entries(updated)) {
                if (value === vehicleId) {
                    delete updated[key];
                }
            }

            return updated;
        });
    }, []);

    return (
        <TrafficControllerContext.Provider value={{ registerVehicle, requestMove, deregisterVehicle, occupiedCoordinates }}>
            {children}
        </TrafficControllerContext.Provider>
    );
};

export default TrafficControllerProvider;
