import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VehicleComponent = () => {
    const [randomVehicle, setRandomVehicle] = useState(null);

    useEffect(() => {
        const fetchRandomVehicle = async () => {
            try {
                // FETCH  A RANDOM VEHICLE FROM THE BACKEND //
                const response = await axios.get('/api/vehicles/random');
                setRandomVehicle(response.data);
            } catch (error) {
                console.error('Error fetching random vehicle:', error);
            }
        };

        // CALL fetchRandomVehicle FUNCTION ON COMPONENT MOUNT //
        fetchRandomVehicle();
    }, []);


    return (
        <div>
            {/* DISPLAY THE DETAILS OF TEH RANDOM VEHICLE */}
            {randomVehicle && (
                <div>
                    <p>Random Vehicle:</p>
                    <p>Type: {randomVehicle.type}</p>
                    <p>Path: {randomVehicle.path}</p>
                </div>
            )}
        </div>
    );
};

export default VehicleComponent;