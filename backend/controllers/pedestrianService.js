// controllers/pedestrianService.js

const Pedestrian = require('../models/pedestrian');
const socket = require('../utils/socket');
const collisionUtils = require('../utils/collisionUtils');

// DESTRUCTURE IMPORTS FROM COLLISION UTILS //
const { occupiedCoordinates, addOccupant, removeOccupant } = collisionUtils;

// Define the pedestrian's path coordinates
const pedestrianCoordinates = [
  { x: 49.4, y: 93.8 },
  { x: 49.7, y: 78.1 },
  { x: 50, y: 67.2 },
  { x: 50.1, y: 63.3 },
  { x: 50.1, y: 59.2 },
  { x: 50.3, y: 52.6 },
];

// FUNCTION TO INITIALIZE PEDESTRIAN //
const initializePedestrian = async (pedestrian, simulationType) => {
  if (!simulationType) {
    throw new Error('simulationType is required to initialize pedestrian.');
  }

  const occupancyMap = occupiedCoordinates[simulationType];

  if (!occupancyMap) {
    throw new Error(`Invalid simulationType: ${simulationType}`);
  }

  pedestrian.path = pedestrianCoordinates;
  pedestrian.currentPosition = pedestrianCoordinates[0];
  pedestrian.currentIndex = 0;
  pedestrian.score = pedestrian.score || 0;
  pedestrian.health = pedestrian.health || 100;
  pedestrian.isMoving = false;
  pedestrian.isWaiting = false;
  pedestrian.waitUntil = null;

  // SAVE THE PEDESTRIAN TO THE DATABASE //
  await pedestrian.save();

  // ADD THE PEDESTRIAN'S INITIAL POSITION TO THE OCCUPANCY MAP //
  // const initialCoordKey = `${pedestrian.currentPosition.x},${pedestrian.currentPosition.y}`;
  // if (occupancyMap.has(initialCoordKey)) {
  //   throw new Error('Cannot create pedestrian at an occupied coordinate.');
  // }
  // occupancyMap.set(initialCoordKey, pedestrian._id);

  const initialCoordKey = `${pedestrian.currentPosition.x},${pedestrian.currentPosition.y}`;
  if (occupancyMap.has(initialCoordKey)) {
    throw new Error('Cannot create pedestrian at an occupied coordinate.');
  }

  // ADD THE PEDESTIRIAN TO THE OCCUPANCY MAP WITH TIMESTAMP //
  addOccupant(simulationType, initialCoordKey, {
    entityId: pedestrian._id,
    entityType: 'pedestrian',
    occupiedAt: Date.now()
  });



  // EMITE THE NEW PEDESTRIAN TO CLIENTS //
  const io = socket.getIo();
  // io.emit('newPedestrian', pedestrian);
  io.to(simulationType).emit('newPedestrian', pedestrian);

  console.log(`Pedestrian ${pedestrian._id} initialized at position (${pedestrian.currentPosition.x}, ${pedestrian.currentPosition.y}) in simulation ${simulationType}.`);
};

// FUNCTION TO UPDATE PEDESTRIAN POSITION //
const updatePedestrianPosition = async (pedestrian, direction, simulationType) => {
  if (!simulationType) {
    throw new Error('simulationType is require to update pedestrian position.');
  }

  const occupancyMap = occupiedCoordinates[simulationType];

  if (!occupancyMap) {
    throw new Error(`Invalid simulationType: ${simulationType}`);
  }

  const path = pedestrian.path || pedestrianCoordinates;
  let currentIndex = pedestrian.currentIndex;

  // DETERMINE THE NEXT INDEX BASED ON USER INPUT //
  let nextIndex = currentIndex;

  if (direction === 'forward' && currentIndex < path.length - 1) {
    nextIndex += 1;
  } else if (direction === 'backward' && currentIndex > 0) {
    nextIndex -= 1;
  } else {
    // INVALID MOVE OR AT THE END OF THE PATH //
    console.log(`Pedestrian ${pedestrian._id} cannot move ${direction}.`);
    return;
  }

  const nextPosition = path[nextIndex];
  const nextCoordKey = `${nextPosition.x},${nextPosition.y}`;

  // COLLISION DETECTION //
  if (occupancyMap.has(nextCoordKey)) {
    console.log(
      `Pedestrian ${pedestrian._id} cannot move to (${nextPosition.x}, ${nextPosition.y}) because it is occupied by ${occupant.entityType} ${occupant.entityId}.`
    );
    // Handle collision logic here (e.g., reduce health, notify user)
    return;
  }

  // MOVE THE PEDESTRIAN //
  // REMOVE FROM OLD POSITION IN OCCUPANCY MAP //
  const currentCoordKey = `${pedestrian.currentPosition.x},${pedestrian.currentPosition.y}`;
  // occupancyMap.delete(currentCoordKey);
  removeOccupant(simulationType, currentCoordKey, pedestrian._id);

  // UPDATE PEDESTRIAN'S POSITION AND INDEX //
  pedestrian.currentPosition = nextPosition;
  pedestrian.currentIndex = nextIndex;

  // ADD TO NEW POSITION IN OCCUPANCY MAP //
  // occupancyMap.set(nextCoordKey, pedestrian._id);
  addOccupant(simulationType, nextCoordKey, {
    entityId: pedestrian._id,
    entityType: 'pedestrian',
    occupiedAt: Date.now()
  });

  await pedestrian.save();

  // EMIT THE UPDATE TO CLIENTS //
  // const io = socket.getIo();
  // io.emit('updatePedestrian', {
  //   ...pedestrian.toObject(),
  //   simulationType,
  // });
  const io = socket.getIo();
  io.to(simulationType).emit('updatePedestrian', {
    ...pedestrian.toObject(),
    simulationType,
  });

  console.log('Emitted updatePedestrian with:', {
    ...pedestrian.toObject(),
    simulationType,
  });

  console.log(
    `Pedestrian ${pedestrian._id} moved to position (${nextPosition.x}, ${nextPosition.y}) in simulation ${simulationType}. Current index: ${pedestrian.currentIndex}`
  );
};



// FUNCTION TO DELETE PEDESTRIAN
const deletePedestrian = async (pedestrianId, simulationType) => {
  if (!simulationType) {
    throw new Error('simulationType is required to delete pedestrian.');
  }

  const occupancyMap = occupiedCoordinates[simulationType];

  if (!occupancyMap) {
    throw new Error(`Invalid simulationType: ${simulationType}`);
  }

  const io = socket.getIo();

  // REMOVE FROM OCCUPANCY MAP IS STILL PRESENT //
  // for (const [coordKey, id] of occupancyMap.entries()) {
  //   if (id.toString() === pedestrianId.toString()) {
  //     occupancyMap.delete(coordKey);
  //     break;
  //   }
  // }
  for (const [coordKey, occupant] of occupancyMap.entries()) {
    if (occupant.entityId.toString() === pedestrianId.toString() && occupant.entityType === 'pedestrian') {
        occupancyMap.delete(coordKey);
        break;
    }
  }

  await Pedestrian.findByIdAndDelete(pedestrianId);

  // EMIT THE REMOVE PEDESTRIAN EVENT TO CLIENTS //
  // io.emit('removePedestrian', pedestrianId);
  io.to(simulationType).emit('removePedestrian', pedestrianId);

  console.log(`Pedestrian ${pedestrianId} has been deleted from simulation ${simulationType}.`);
};

module.exports = {
  initializePedestrian,
  updatePedestrianPosition,
  deletePedestrian,
};
