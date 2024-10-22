// utils/collisionUtils.js

// OCCUPANCY MAP TO TRACK OCCUPIED COORDINATES
const occupiedCoordinates = new Map();

// STOP SIGN AND INTERSECTION COORDINATES
const stopSignCoordinates = [
    { x: 625, y: 750 },
    { x: 250, y: 625 },
    { x: 375, y: 250 },
    { x: 750, y: 375 },
];

const intersectionCoordinates = [
    { x: 657, y: 719 },
    { x: 688, y: 688 },
    { x: 719, y: 657 },
    { x: 625, y: 625 },
    { x: 625, y: 500 },
    { x: 625, y: 375 },
    { x: 500, y: 375 },
    { x: 282, y: 657 },
    { x: 313, y: 688 },
    { x: 344, y: 719 },
    { x: 375, y: 625 },
    { x: 500, y: 625 },
    { x: 344, y: 282 },
    { x: 313, y: 313 },
    { x: 282, y: 344 },
    { x: 375, y: 375 },
    { x: 375, y: 500 },
    { x: 719, y: 344 },
    { x: 688, y: 313 },
    { x: 657, y: 282 },
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
