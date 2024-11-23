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

// Define the pedestrian's path coordinates
const pedestrianCoordinates = [
  { x: 49.4, y: 93.8 },
  { x: 49.7, y: 78.1 },
  { x: 50, y: 67.2 },
  { x: 50.1, y: 63.3 },
  { x: 50.1, y: 59.2 },
  { x: 50.3, y: 52.6 },
];

// FUNCTION TO INITIALIZE PEDESTRIAN
const initializePedestrian = async (pedestrian) => {
  pedestrian.path = pedestrianCoordinates;
  pedestrian.currentPosition = pedestrianCoordinates[0];
  pedestrian.currentIndex = 0;
  pedestrian.score = pedestrian.score || 0;
  pedestrian.health = pedestrian.health || 100;
  pedestrian.isMoving = false;
  pedestrian.isWaiting = false;
  pedestrian.waitUntil = null;

  // Save the pedestrian to the database
  await pedestrian.save();

  // Add the pedestrian's initial position to the occupiedCoordinates map
  const initialCoordKey = `${pedestrian.currentPosition.x},${pedestrian.currentPosition.y}`;
  if (occupiedCoordinates.has(initialCoordKey)) {
    throw new Error('Cannot create pedestrian at an occupied coordinate.');
  }
  occupiedCoordinates.set(initialCoordKey, pedestrian._id);

  // Emit the new pedestrian to clients
  const io = socket.getIo();
  io.emit('newPedestrian', pedestrian);

  console.log(`Pedestrian ${pedestrian._id} initialized at position (${pedestrian.currentPosition.x}, ${pedestrian.currentPosition.y}).`);
};

// FUNCTION TO UPDATE PEDESTRIAN POSITION
const updatePedestrianPosition = async (pedestrian, direction) => {
  const path = pedestrian.path || pedestrianCoordinates;
  let currentIndex = pedestrian.currentIndex;

  // Determine the next index based on user input
  let nextIndex = currentIndex;

  if (direction === 'forward' && currentIndex < path.length - 1) {
    nextIndex += 1;
  } else if (direction === 'backward' && currentIndex > 0) {
    nextIndex -= 1;
  } else {
    // Invalid move or at the end of the path
    console.log(`Pedestrian ${pedestrian._id} cannot move ${direction}.`);
    return;
  }

  const nextPosition = path[nextIndex];
  const nextCoordKey = `${nextPosition.x},${nextPosition.y}`;

  // Collision detection
  if (occupiedCoordinates.has(nextCoordKey)) {
    console.log(
      `Pedestrian ${pedestrian._id} cannot move to (${nextPosition.x}, ${nextPosition.y}) because it is occupied by ${occupiedCoordinates.get(
        nextCoordKey
      )}.`
    );
    // Handle collision logic here (e.g., reduce health, notify user)
    return;
  }

  // Move the pedestrian
  // Remove from old position in occupancy map
  const currentCoordKey = `${pedestrian.currentPosition.x},${pedestrian.currentPosition.y}`;
  occupiedCoordinates.delete(currentCoordKey);

  // Update pedestrian's position and index
  pedestrian.currentPosition = nextPosition;
  pedestrian.currentIndex = nextIndex;

  // Add to new position in occupancy map
  occupiedCoordinates.set(nextCoordKey, pedestrian._id);

  await pedestrian.save();

  // Emit the update to clients
  const io = socket.getIo();
  io.emit('updatePedestrian', pedestrian);

  console.log(
    `Pedestrian ${pedestrian._id} moved to position (${nextPosition.x}, ${nextPosition.y}). Current index: ${pedestrian.currentIndex}`
  );
};

// FUNCTION TO DELETE PEDESTRIAN
const deletePedestrian = async (pedestrianId) => {
  const io = socket.getIo();

  // Remove from occupancy map if still present
  for (const [coordKey, id] of occupiedCoordinates.entries()) {
    if (id.toString() === pedestrianId.toString()) {
      occupiedCoordinates.delete(coordKey);
      break;
    }
  }

  await Pedestrian.findByIdAndDelete(pedestrianId);

  // Emit the remove pedestrian event to clients
  io.emit('removePedestrian', pedestrianId);

  console.log(`Pedestrian ${pedestrianId} has been deleted.`);
};

module.exports = {
  initializePedestrian,
  updatePedestrianPosition,
  deletePedestrian,
};
