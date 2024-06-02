import { createContext, useContext, useEffect, useState } from 'react';

// Create a context for the Traffic Controller
const TrafficControllerContext = createContext();

export const useTrafficController = () => useContext(TrafficControllerContext);

const TrafficControllerProvider = ({ children }) => {
    const [vehicles, setVehicles] = useState([]);
    const [occupiedCoordinates, setOccupiedCoordinates] = useState({});

    const registerVehicle = (vehicle) => {
        const position = vehicle.position || { x: 0, y: 0 };
        vehicle.position = position;

        setVehicles((prevVehicles) => [...prevVehicles, vehicle]);
        setOccupiedCoordinates((prev) => ({
            ...prev,
            [`${position.x},${position.y}`]: vehicle._id,
        }));
    };

    const requestMove = (vehicleId, newPosition) => {
        const key = `${newPosition.x},${newPosition.y}`;
        if (!occupiedCoordinates[key]) {
            setVehicles((prevVehicles) => prevVehicles.map(vehicle => 
                vehicle._id === vehicleId ? { ...vehicle, position: newPosition } : vehicle
            ));
            setOccupiedCoordinates((prev) => {
                const updated = { ...prev };
                const vehicle = vehicles.find(v => v._id === vehicleId);
                if (vehicle) {
                    delete updated[`${vehicle.position.x},${vehicle.position.y}`];
                }
                updated[key] = vehicleId;
                return updated;
            });
            return true;
        }
        return false;
    };

    const deregisterVehicle = (vehicleId) => {
        setVehicles((prevVehicles) => prevVehicles.filter(vehicle => vehicle._id !== vehicleId));
        setOccupiedCoordinates((prev) => {
            const updated = { ...prev };
            const vehicle = vehicles.find(v => v._id === vehicleId);
            if (vehicle) {
                delete updated[`${vehicle.position.x},${vehicle.position.y}`];
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
