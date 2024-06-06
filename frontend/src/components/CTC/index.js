import { createContext, useContext, useState } from 'react';

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

    const requestMove = (vehicleId, newPosition) => {
        const key = `${newPosition.x},${newPosition.y}`;
        console.log(`Requesting move for vehicle ${vehicleId} to position (${newPosition.x}, ${newPosition.y})`);

        if (!occupiedCoordinates[key]) {
            setVehicles((prevVehicles) => {
                return prevVehicles.map(vehicle => {
                    if (vehicle._id === vehicleId) {
                        const prevKey = `${vehicle.position.x},${vehicle.position.y}`;
                        const updatedVehicle = { ...vehicle, position: newPosition };
                        setOccupiedCoordinates(prev => {
                            const updated = { ...prev };
                            delete updated[prevKey]; // Free up the previous position
                            updated[key] = vehicleId;
                            return updated;
                        });
                        return updatedVehicle;
                    }
                    return vehicle;
                });
            });
            console.log(`Move granted for vehicle ${vehicleId} to position (${newPosition.x}, ${newPosition.y})`);
            return true;
        }
        console.log(`Move denied for vehicle ${vehicleId} to position (${newPosition.x}, ${newPosition.y})`);
        return false;
    };

    const deregisterVehicle = (vehicleId) => {
        setVehicles((prevVehicles) => prevVehicles.filter(vehicle => vehicle._id !== vehicleId));
        setOccupiedCoordinates((prev) => {
            const updated = { ...prev };
            const vehicle = vehicles.find(v => v._id === vehicleId);
            if (vehicle) {
                delete updated[`${vehicle.position.x},${vehicle.position.y}`];  // Free up the final position
            }
            return updated;
        });
    };

    return (
        <TrafficControllerContext.Provider value={{ registerVehicle, requestMove, deregisterVehicle }}>
            {children}
        </TrafficControllerContext.Provider>
    );
};

export default TrafficControllerProvider;
