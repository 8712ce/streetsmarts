import React, { useEffect, useState } from 'react';
import './automobile.css';

import { getRandomVehicle } from '../../utils/api';

function MovingAutomobile() {
    const [pathCoordinates, setPathCoordinates] = useState([]);
    const [automobilePosition, setAutomobilePosition] = useState({ x: 0, y: 0 });

    const setNewAutomobile = () => {
        getRandomVehicle()
            .then(newPath => {
                setPathCoordinates(newPath[0].path);
            })
            .catch(error => {
                console.error('Error setting new automobile:', error);
            });
    };

    const moveAutomobile = (pathCoordinates) => {
        // Initialize the index to keep track of the current coordinate
        let index = 0;

        // Function to move the automobile to the next coordinate
        const moveNext = () => {
            if (index < pathCoordinates.length) {
                const { x, y } = pathCoordinates[index];
                setAutomobilePosition({ x, y });

                // Check if the current coordinate matches any stop sign coordinate
                if (isStopSignCoordinate({ x, y })) {
                    // Pause the movement for a certain duration (e.g., 3 seconds)
                    setTimeout(() => {
                        index++; // Move to the next coordinate after the pause
                        moveNext();
                    }, 3000); // Adjust the duration of the stop as needed
                } else {
                    index++; // Move to the next coordinate
                    setTimeout(moveNext, 1000); // Move to the next coordinate after 1 second
                }

                // // IF THE AUTOMOBILE REACHES THE FINAL COORDINATE, DELETE IT //
                // if (index === pathCoordinates.length) {
                //     deleteAutomobile(); // FUNCTION TO DELETE AUTOMOBILE FROM BACKEND //
                // }
            }
        };

        // Start moving the automobile
        moveNext();
    };

    // // FUNCTION TO DELETE THE AUTOMOBILE FROM THE BACKEND //
    // const deleteAutomobile = () => {
    //     // MAKE A REQUEST TO THE DELETE ROUTE OF BACKEND API //
    //     deleteVehicle(/* PASS ANY REQUIRED PARAMETER SUCH AS VEHICLE ID */)
    //         .then(respond => {
    //             console.log('Automobile deleted:', response);
    //         })
    //         .catch(error => {
    //             console.error('Error deleting automobile:', error);
    //         });
    // };

    // Function to check if a given coordinate is a stop sign coordinate
    const isStopSignCoordinate = (coordinate) => {
        const stopSignCoordinates = [
            // DEFINE STOP SIGN COORDINATES HERE //
            { x: 520, y: 290 },
            { x: 460, y: 270 },
            { x: 480, y: 210 },
            { x: 540, y: 230 },
        ];

        return stopSignCoordinates.some(stopCoord => stopCoord.x === coordinate.x && stopCoord.y === coordinate.y);
    };

    useEffect(() => {
        // MOVE THE AUTOMOBILE WHEN pathCoordinates CHANGE //
        if (pathCoordinates.length > 0) {
            moveAutomobile(pathCoordinates);
        }
    }, [pathCoordinates]);

    return (
        <div>
            <div className="container">
                <div className="automobile" style={{ transform: `translate(${automobilePosition.x}px, ${automobilePosition.y}px)` }}></div>
            </div>
            <button onClick={() => setNewAutomobile()}>Get Automobile</button>
            <button onClick={() => moveAutomobile(pathCoordinates)}>Move Automobile</button>
        </div>
    );
}

export default MovingAutomobile;
