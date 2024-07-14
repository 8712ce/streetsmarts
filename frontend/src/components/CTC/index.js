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

        if (occupiedCoordinates[newPositionKey]) {
            return false;
        }

        setOccupiedCoordinates((prev) => {
            const updated = { ...prev };

            for (const [key, value] of Object.entries(updated)) {
                if (value === vehicleId) {
                    delete updated[key];
                }
            }

            updated[newPositionKey] = vehicleId;
            return updated;
        });

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
