import React, { useEffect, useState } from 'react';
import './MovingSquare.css'; // Import CSS file for styling

import { getRandomVehicle } from '../../utils/api';

function MovingSquare() {
    const [pathCoordinates, setPathCoordinates] = useState([
        // { x: 10, y: 10 },
        // { x: 20, y: 200 },
        // { x: 300, y: 20 },
    ]);

    
    
    const setNewVehicle = () => {
        getRandomVehicle()
            .then(newPath => {
                console.log(newPath[0].image)
                setPathCoordinates(newPath[0].path);
                console.log(pathCoordinates)
            })
            .catch(error => {
                console.error('Error setting new vehicle:', error);
            });
    };

    
    const moveSquare = (pathCoordinates) => {
        const square = document.querySelector('.square');

        // Move the square to each coordinate in the array sequentially
        pathCoordinates.forEach((coord, index) => {
            const { x, y } = coord;
            setTimeout(() => {
                square.style.transform = `translate(${x}px, ${y}px)`;
            }, index * 1000); // Adjust the delay between movements as needed
        });
    };

    return (
        <div>
            <div className="container">
                <div className="square"></div> {/* Square element */}
            </div>
            <button onClick={() => setNewVehicle()}>Get Vehicle</button> {/* Move square to each coordinate in pathCoordinates */}
            <button onClick={() => moveSquare(pathCoordinates)}>Move Square</button> {/* Move square to each coordinate in pathCoordinates */}
        </div>
    );
}

export default MovingSquare;
