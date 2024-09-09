import React, { useEffect, useState } from 'react';
import './automobile.css';

const Automobile = ({ vehicle, onComplete, socket }) => {
    const [automobilePosition, setAutomobilePosition] = useState(vehicle.currentPosition);

    const [hasRemoved, setHasRemoved] = useState(false); // BOOLEAN FLAG FOR DEREGISTRATION //

    useEffect(() => {
        const handleUpdateVehicle = (updatedVehicle) => {
            if (updatedVehicle._id === vehicle._id) {
                console.log('Automobile component updating position:', updatedVehicle.currentPosition);
                setAutomobilePosition(updatedVehicle.currentPosition);
            }
        };



        const handleRemoveVehicle = (vehicleId) => {
            console.log('Automobile component received removeVehicle for:', vehicleId);
            if (vehicleId === vehicle._id && !hasRemoved) {
                console.log('Automobile component removing vehicle:', vehicleId);
                setHasRemoved(true); // PREVENT MULTIPLE REMOVALS //
                onComplete(vehicleId); // CALL THE onComplete CALLBCK OT NOTIFY APP.JS //
            }
        };



        socket.on('updateVehicle', handleUpdateVehicle);
        socket.on('removeVehicle', handleRemoveVehicle);

        return () => {
            socket.off('updateVehicle', handleUpdateVehicle);
            socket.off('removeVehicle', handleRemoveVehicle);
        };
    }, [vehicle, onComplete, socket, hasRemoved]);

    return (
        <div className="automobile" style={{ transform: `translate(${automobilePosition.x}px, ${automobilePosition.y}px)` }}>
            {vehicle && <img src={vehicle.image} alt={vehicle.type} className="vehicle-image" />}
        </div>
    );
};

export default Automobile;
