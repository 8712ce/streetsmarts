// controllers/pedestrianService.js

const Pedestrian = require('../models/pedestrian');
const socket = require('../utils/socket');
const collisionUtils = require('../utils/collisionUtils');

// Destructure the imports for convenience
const {
    occupiedCoordinates,
    stopSignQueues,
    isStopSignCoordinate,
    isIntersectionCoordinate,
    isIntersectionOccupied,
} = collisionUtils;

const pedestrianCoordinates = [
    { x: 812, y: 937 },
    { x: 812, y: 812 },
    { x: 812, y: 625 },
    { x: 812, y: 500 },
    { x: 812, y: 375 },
    { x: 812, y: 187 },
  ];

// FUNCTION TO UPDATE PEDESTRIAN POSITION
const updatePedestrianPosition = async (pedestrian, direction) => {
    // 'direction' could be 'forward', 'backward', etc.

    const path = pedestrian.path || pedestrianCoordinates;
    let currentIndex = pedestrian.currentIndex;

    // Determine next index based on user input
    let nextIndex = currentIndex;

    if (direction === 'forward' && currentIndex < path.length - 1) {
        nextIndex = currentIndex + 1;
    } else if (direction === 'backward' && currentIndex > 0) {
        nextIndex = currentIndex - 1;
    } else {
        // Invalid move
        return;
    }

    const nextPosition = path[nextIndex];
    const nextCoordKey = `${nextPosition.x},${nextPosition.y}`;

    // Check for collisions
    if (occupiedCoordinates.has(nextCoordKey)) {
        console.log(
            `Pedestrian ${pedestrian._id} cannot move to ${nextCoordKey} because it is occupied by ${occupiedCoordinates.get(
                nextCoordKey
            )}.`
        );
        // Handle collision (e.g., notify user)
        return;
    }

    // Move the pedestrian
    // Remove from old position in occupancy map
    occupiedCoordinates.delete(`${pedestrian.currentPosition.x},${pedestrian.currentPosition.y}`);

    // Update pedestrian's position and index
    pedestrian.currentPosition = nextPosition;
    pedestrian.currentIndex = nextIndex;

    // Add to new position in occupancy map
    occupiedCoordinates.set(nextCoordKey, pedestrian._id);

    await pedestrian.save();

    // Emit the update to clients
    const io = socket.getIo();
    io.emit('updatePedestrian', pedestrian);

    // Additional logic like checking for safe crossing can be added here

    console.log(
        `Pedestrian ${pedestrian._id} moved to position (${nextPosition.x}, ${nextPosition.y}). Current index: ${pedestrian.currentIndex}`
    );
};

module.exports = {
    updatePedestrianPosition, pedestrianCoordinates
};
