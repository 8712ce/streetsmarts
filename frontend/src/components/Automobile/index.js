import React, { useEffect, useState } from 'react';
import './automobile.css';
// import { useTrafficController } from '../CTC';
import { deleteVehicle } from '../../utils/api';

const Automobile = ({ vehicle, onComplete, socket }) => {
    const [automobilePosition, setAutomobilePosition] = useState(vehicle.currentPosition);

    useEffect(() => {
        const handleUpdateVehicle = (updatedVehicle) => {
            if (updatedVehicle._id === vehicle._id) {
                setAutomobilePosition(updatedVehicle.currentPosition);
            }
        };



        const handleRemoveVehicle = (vehicleId) => {
            if (vehicleId === vehicle._id) {
                onComplete(vehicleId);
            }
        };



        socket.on('updateVehicle', handleUpdateVehicle);
        socket.on('removeVehicle', handleRemoveVehicle);

        return () => {
            socket.off('updateVehicle', handleUpdateVehicle);
            socket.off('removeVehicle', handleRemoveVehicle);
        };
    }, [vehicle, onComplete, socket]);

    return (
        <div className="automobile" style={{ transform: `translate(${automobilePosition.x}px, ${automobilePosition.y}px)` }}>
            {vehicle && <img src={vehicle.image} alt={vehicle.type} className="vehicle-image" />}
        </div>
    );
};

export default Automobile;
