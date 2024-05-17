import React, { useState } from 'react';
import '../Automobile/automobile.css';
import { getRandomVehicle } from '../../utils/api';
import Automobile from '../Automobile';

function MovingAutomobile() {
    const [vehicles, setVehicles] = useState([]); // State to store the list of vehicles

    const setNewAutomobile = () => {
        getRandomVehicle()
            .then(vehicle => {
                setVehicles(prevVehicles => [...prevVehicles, vehicle]);
            })
            .catch(error => {
                console.error('Error setting new automobile:', error);
            });
    };

    const removeAutomobile = (vehicleId) => {
        setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle._id !== vehicleId));
    };

    return (
        <div>
            <div className="container">
                {vehicles.map(vehicle => (
                    <Automobile key={vehicle._id} vehicle={vehicle} onComplete={removeAutomobile} />
                ))}
            </div>
            <button onClick={setNewAutomobile}>Get Automobile</button>
        </div>
    );
}

export default MovingAutomobile;
