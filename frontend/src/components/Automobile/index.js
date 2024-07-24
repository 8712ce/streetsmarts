import React, { useEffect, useState } from 'react';
import './automobile.css';
import { useTrafficController } from '../CTC';
import { deleteVehicle } from '../../utils/api';

const Automobile = ({ vehicle, onComplete }) => {
    const initialPosition = vehicle.path && vehicle.path[0] ? vehicle.path[0] : { x: 0, y: 0 };
    const [automobilePosition, setAutomobilePosition] = useState(initialPosition);
    const { requestMove, deregisterVehicle, eventEmitter } = useTrafficController();
    const pathRef = useRef(vehicle.path);
    const currentPositionRef = useRef(initialPosition);
    const [blocked, setBlocked] = useState(false);

    useEffect(() => {
        const moveAutomobile = (pathCoordinates) => {
            let index = 0;

            const moveNext = () => {
                if (index < pathCoordinates.length) {
                    const { x, y } = pathCoordinates[index];
                    const isStopSign = isStopSignCoordinate({ x, y });

                    if (isStopSign) {
                        console.log(`Vehicle ${vehicle._id} has reached a stop sign at (${x}, ${y})`);
                    }
                    
                    console.log(`Vehicle ${vehicle._id} attempting to move from (${currentPositionRef.current.x}, ${currentPositionRef.current.y}) to (${x}, ${y})`);

                    if (requestMove(vehicle._id, { x, y })) {
                        console.log(`Move successful for vehicle ${vehicle._id} to position (${x}, ${y})`);
                        currentPositionRef.current = { x, y };
                        setAutomobilePosition({ x, y });
                        index++;
                        setTimeout(moveNext, isStopSign ? 3000 : 1000);
                    } else {
                        console.log(`Move blocked for vehicle ${vehicle._id} at position (${x}, ${y})`);
                        setBlocked(true);
                    }

                    if (index === pathCoordinates.length) {
                        setTimeout(async () => {
                            await deleteAutomobile(vehicle._id);
                            onComplete(vehicle._id);
                        }, 1000);
                    }
                }
            };

            moveNext();
        };

        if (vehicle && vehicle.path) {
            moveAutomobile(pathRef.current);
        }

        const handleCoordinateFreed = (coordinate) => {
            const [x, y] = coordinate.split(',').map(Number);
            if (blocked && currentPositionRef.current.x === x && currentPositionRef.current.y === y) {
                setBlocked(false);
                moveAutomobile(pathRef.current);
            }
        };

        eventEmitter.on('coordinateFreed', handleCoordinateFreed);

        return () => {
            eventEmitter.off('coordinateFreed', handleCoordinateFreed);
        };
    }, [vehicle]);

    const deleteAutomobile = async (vehicleId) => {
        try {
            await deleteVehicle(vehicleId);
            deregisterVehicle(vehicleId);
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
