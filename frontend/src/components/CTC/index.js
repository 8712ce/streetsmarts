import { createContext, useContext } from 'react';
import { EventEmitter } from 'events';

const TrafficControllerContext = createContext();
const eventEmitter = new EventEmitter();

export const useTrafficController = () => {
    const context = useContext(TrafficControllerContext);
    if (!context) {
        throw new Error('useTrafficController must be used within a TrafficControllerProvider');
    }
    return context;
};

const TrafficControllerProvider = ({ children }) => {
    const [occupiedCoordinates, setOccupiedCoordinates] = useState({});

    const registerVehicle = useCallback((vehicle) => {
        const initialPosition = vehicle.path && vehicle.path[0] ? vehicle.path[0] : { x: 0, y: 0 };
        vehicle.position = initialPosition;
        const positionKey = `${initialPosition.x},${initialPosition.y}`;

        setOccupiedCoordinates((prev) => ({
            ...prev,
            [positionKey]: vehicle._id,
        }));
    }, []);

    const requestMove = useCallback((vehicleId, newPosition) => {
        const newPositionKey = `${newPosition.x},${newPosition.y}`;

        console.log(`Vehicle ${vehicleId} requesting move to (${newPosition.x}, ${newPosition.y})`);
        console.log('Current occupied coordinates:', occupiedCoordinates);

        if (occupiedCoordinates[newPositionKey]) {
            console.log(`Move denied for vehicle ${vehicleId} to position (${newPosition.x}, ${newPosition.y}) - Position already occupied`);
            return false;
        }

        setOccupiedCoordinates((prev) => {
            const updated = { ...prev };

            console.log(`Occupied coordinates before removing previous position for vehicle ${vehicleId}:`, updated);

            for (const [key, value] of Object.entries(updated)) {
                if (value === vehicleId) {
                    delete updated[key];
                    console.log(`Coordinate ${key} freed by vehicle ${vehicleId}`);
                }
            }

            updated[newPositionKey] = vehicleId;

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
                    eventEmitter.emit('coordinateFreed', key);
                    console.log(`Vehicle ${vehicleId} deregistered from coordinate ${key}`);
                }
            }

            return updated;
        });
    }, []);

    return (
        <TrafficControllerContext.Provider value={{ registerVehicle, requestMove, deregisterVehicle, occupiedCoordinates, eventEmitter }}>
            {children}
        </TrafficControllerContext.Provider>
    );
};

export default TrafficControllerProvider;
