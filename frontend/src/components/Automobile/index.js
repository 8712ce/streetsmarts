import React, { useEffect, useState } from 'react';
import './automobile.css';
import { getRandomVehicle } from '../../utils/api';

function MovingAutomobile() {
    const [pathCoordinates, setPathCoordinates] = useState([]);
    const [automobilePosition, setAutomobilePosition] = useState({ x: 0, y: 0 });
    const [vehicle, setVehicle] = useState(null); // State to store the vehicle data

    const setNewAutomobile = () => {
        getRandomVehicle()
            .then(vehicle => {
                setPathCoordinates(vehicle.path);
                setVehicle(vehicle);
            })
            .catch(error => {
                console.error('Error setting new automobile:', error);
            });
    };

    const moveAutomobile = (pathCoordinates) => {
        let index = 0;

        const moveNext = () => {
            if (index < pathCoordinates.length) {
                const { x, y } = pathCoordinates[index];
                setAutomobilePosition({ x, y });

                if (isStopSignCoordinate({ x, y })) {
                    setTimeout(() => {
                        index++;
                        moveNext();
                    }, 3000);
                } else {
                    index++;
                    setTimeout(moveNext, 1000);
                }

                // IF THE AUTOMOBILE REACHES THE FINAL COORDINATE, DELETE IT //
                // if (index === pathCoordinates.length) {
                //     deleteAutomobile(); // FUNCTION TO DELETE AUTOMOBILE FROM BACKEND //
                // }
            }
        };

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

    const isStopSignCoordinate = (coordinate) => {
        const stopSignCoordinates = [
            { x: 520, y: 290 },
            { x: 460, y: 270 },
            { x: 480, y: 210 },
            { x: 540, y: 230 },
        ];

        return stopSignCoordinates.some(stopCoord => stopCoord.x === coordinate.x && stopCoord.y === coordinate.y);
    };

    useEffect(() => {
        if (pathCoordinates.length > 0) {
            moveAutomobile(pathCoordinates);
        }
    }, [pathCoordinates]);

    return (
        <div>
            <div className="container">
                <div className="automobile" style={{ transform: `translate(${automobilePosition.x}px, ${automobilePosition.y}px)` }}>
                    {vehicle && <img src={vehicle.image} alt={vehicle.type} className="vehicle-image" />} {/* Display vehicle image */}
                </div>
            </div>
            <button onClick={setNewAutomobile}>Get Automobile</button>
            <button onClick={() => moveAutomobile(pathCoordinates)}>Move Automobile</button>
        </div>
    );
}

export default MovingAutomobile;
