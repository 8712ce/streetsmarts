import React, { useEffect, useState } from 'react';
import './automobile.css';
import { useTrafficController } from '../CTC';
import { deleteVehicle } from '../../utils/api';

const Automobile = ({ vehicle, onComplete }) => {
    const [automobilePosition, setAutomobilePosition] = useState(vehicle.currentPosition);

    useEffect(() => {
        const handleUpdateVehicle = (updatedVehicle) => {
            if (updatedVehicle._id === vehicleId) {
                setAutomobilePosition(updatedVehicle.currentPosition);
            }
        };



        const handleRemoveVehicle = (vehicleId) => {
            if (vehicleId === vehicle._id) {
                onComplete(vehicleId);
            }
        };



        socket.on('updatedVehicle', handleUpdateVehicle);
        socket.on('removeVehicle', handleRemoveVehicle);

        return () => {
            socket.off('updatedVehicle', handleUpdateVehicle);
            socket.off('removeVehicle', handleRemoveVehicle);
        };
    }, [vehicle, onComplete]);

    return (
        <div className="automobile" style={{ transform: `translate(${automobilePosition.x}px, ${automobilePosition.y}px)` }}>
            {vehicle && <img src={vehicle.image} alt={vehicle.type} className="vehicle-image" />}
        </div>
    );
};

export default Automobile;
