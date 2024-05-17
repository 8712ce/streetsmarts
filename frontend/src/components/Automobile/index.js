import React, { useEffect, useState } from 'react';
import './automobile.css';
import { deleteVehicle } from '../../utils/api';

const Automobile = ({ vehicle, onComplete }) => {
    const [automobilePosition, setAutomobilePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
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
                    if (index === pathCoordinates.length) {
                        setTimeout(async () => {
                            await deleteAutomobile(vehicle._id); // PASS THE VEHICLE ID TO THE deleteAutomobile FUNCTION //
                            onComplete(vehicle._id); // Notify parent to remove this automobile
                        }, 1000);
                    }
                }
            };

            moveNext();
        };

        if (vehicle && vehicle.path) {
            moveAutomobile(vehicle.path);
        }
    }, [vehicle]);

    // FUNCTION TO DELETE THE AUTOMOBILE FROM THE BACKEND //
    const deleteAutomobile = async (vehicleId) => {
        try {
            const response = await deleteVehicle(vehicleId);
            console.log('Automobile deleted:', response);
        } catch (error) {
            console.error('Error deleting automobile:', error);
        }
    };

    const isStopSignCoordinate = (coordinate) => {
        const stopSignCoordinates = [
            { x: 520, y: 290 },
            { x: 460, y: 270 },
            { x: 480, y: 210 },
            { x: 540, y: 230 },
        ];

        return stopSignCoordinates.some(stopCoord => stopCoord.x === coordinate.x && stopCoord.y === coordinate.y);
    };

    return (
        <div className="automobile" style={{ transform: `translate(${automobilePosition.x}px, ${automobilePosition.y}px)` }}>
            {vehicle && <img src={vehicle.image} alt={vehicle.type} className="vehicle-image" />}
        </div>
    );
};

export default Automobile;
