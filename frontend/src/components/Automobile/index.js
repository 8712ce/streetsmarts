import React, { useEffect, useState } from 'react';
import './automobile.css';

import { getRandomVehicle } from '../../utils/api';

function MovingAutomobile() {
    const [pathCoordinates, setPathCoordinates] = useState([]);
    
    const setNewAutomobile = () => {
        getRandomVehicle()
            .then(newPath => {
                console.log(newPath[0].image)
                setPathCoordinates(newPath[0].path);
                console.log(pathCoordinates)
            })
            .catch(error => {
                console.error('Error setting new automobile:', error);
            });
    };

    
    const moveAutomobile = (pathCoordinates) => {
        const automobile = document.querySelector('.automobile');

        // Move the automobile to each coordinate in the array sequentially
        pathCoordinates.forEach((coord, index) => {
            const { x, y } = coord;
            setTimeout(() => {
                automobile.style.transform = `translate(${x}px, ${y}px)`;
            }, index * 1000); // Adjust the delay between movements as needed
        });
    };

    return (
        <div>
            <div className="container">
                <div className="automobile"></div> {/* Square element */}
            </div>
            <button onClick={() => setNewAutomobile()}>Get Automobile</button>
            <button onClick={() => moveAutomobile(pathCoordinates)}>Move Automobile</button>
        </div>
    );
}

export default MovingAutomobile;
