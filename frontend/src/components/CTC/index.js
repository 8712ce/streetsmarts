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
    const registerVehicle = (vehicle) => {
        eventEmitter.emit('registerVehicle', vehicle);
    };


    const deregisterVehicle = (vehicleId) => {
        eventEmitter.emit('deregistereVehicle', vehicleId);
    };


    return (
        <TrafficControllerContext.Provider value={{ registerVehicle, deregisterVehicle, eventEmitter }}>
            {children}
        </TrafficControllerContext.Provider>
    );
};

export default TrafficControllerProvider;
