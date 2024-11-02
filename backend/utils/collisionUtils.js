// utils/collisionUtils.js

// OCCUPANCY MAP TO TRACK OCCUPIED COORDINATES
const occupiedCoordinates = new Map();

// STOP SIGN AND INTERSECTION COORDINATES
const stopSignCoordinates = [
    { x: 41, y: 77.5 },
    { x: 27.3, y: 66.7 },
    { x: 36.6, y: 53.5 },
    { x: 48.3, y: 59.5 }
];

const intersectionCoordinates = [
    { x: 41.7, y: 71.8 },
    { x: 43.9, y: 67.8 },
    { x: 46.4, y: 67.2 },
    { x: 42.8, y: 63.4 },
    { x: 43.7, y: 55.9 },
    { x: 39.4, y: 59.2 },
    { x: 31.5, y: 58.6 },
    { x: 29.4, y: 66.9 },
    { x: 31.4, y: 68.4 },
    { x: 32.6, y: 72.6 },
    { x: 38.1, y: 67.6 },
    { x: 35.9, y: 57 },
    { x: 33.8, y: 58.8 },
    { x: 34.5, y: 63.4 },
    { x: 46.9, y: 60.1 },
    { x: 44.8, y: 58.8 },
];

// INITIALIZE STOP SIGN QUEUES
const stopSignQueues = new Map();

// COMBINE STOP SIGN AND INTERSECTION COORDINATES
const allQueueCoordinates = stopSignCoordinates.concat(intersectionCoordinates);

// INITIALIZE QUEUES FOR ALL COORDINATES
allQueueCoordinates.forEach(coord => {
    const key = `${coord.x},${coord.y}`;
    stopSignQueues.set(key, []);
});

// FUNCTION TO CHECK IF COORDINATE IS A STOP SIGN
const isStopSignCoordinate = (coordinate) => {
    return stopSignCoordinates.some(
        stopCoord => stopCoord.x === coordinate.x && stopCoord.y === coordinate.y
    );
};

// FUNCTION TO CHECK IF COORDINATE IS PART OF THE INTERSECTION
const isIntersectionCoordinate = (coordinate) => {
    return intersectionCoordinates.some(
        intersectionCoord => intersectionCoord.x === coordinate.x && intersectionCoord.y === coordinate.y
    );
};

// FUNCTION TO CHECK IF INTERSECTION IS OCCUPIED
const isIntersectionOccupied = (excludeCoordKeys = []) => {
    const occupied = intersectionCoordinates.filter(coord => {
        const coordKey = `${coord.x},${coord.y}`;
        const isOccupied = occupiedCoordinates.has(coordKey);
        const isExcluded = excludeCoordKeys.includes(coordKey);
        return isOccupied && !isExcluded;
    });

    if (occupied.length > 0) {
        console.log(
            `Intersection is occupied at coordinates: ${occupied
                .map(c => `(${c.x}, ${c.y})`)
                .join(', ')}`
        );
        return true;
    } else {
        console.log('Intersection is not occupied.');
        return false;
    }
};

module.exports = {
    occupiedCoordinates,
    stopSignCoordinates,
    intersectionCoordinates,
    stopSignQueues,
    isStopSignCoordinate,
    isIntersectionCoordinate,
    isIntersectionOccupied,
};
