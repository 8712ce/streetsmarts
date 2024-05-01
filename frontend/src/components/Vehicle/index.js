import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VehicleComponent = () => {
    const [randomPath, setRandomPath] = useState(null);

    useEffect(() => {
        const fetchRandomPath = async () => {
            try {
                const response = await axios.get('/api/paths/random');
                setRandomPath(response.data);
            } catch (error) {
                console.error('Error fetching random path:', error);
            }
        };

        const postVehicle = async () => {
            try {
                // FETCH RANDOM PATH //
                await fetchRandomPath();

                // POST VEHICLE WITH THE FETCHED RANDOM PATH //
                const newVehicle = {
                    type: 'car',
                    path: randomPath, // ASSIGNING THE RANDOM PATH HERE //
                    // OTHER VEHICLE PROPERTIES HERE //
                };

                // POST THE NEW VEHICLE TO YOUR BACKEND //
                await axios.post('/api/vehicles', newVehicle);
            } catch (error) {
                console.error('Error posting vehicle:', error);
            }
        };

        // CALL postVehicle FUNCTION ON COMPONENT MOUNT //
        postVehicle();
    }, []);


    return (
        <div>
            
        </div>
    );
};

export default VehicleComponent;