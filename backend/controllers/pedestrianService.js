// controllers/pedestrianService.js

const Pedestrian = require('../models/pedestrian');
const socket = require('../utils/socket');
const collisionUtils = require('../utils/collisionUtils');
const { Student } = require('../models');
const { Teacher } = require('../models');

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

// DEFINE STREET CORNER COORDINATE //
const streetCorner = { x: 49.7, y: 78.1 };

// DEFINE YELLOW CENTER LINE COORDINATE //
const centerLine = { x: 50.1, y: 63.3 };



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

  if (nextPosition.x === streetCorner.x && nextPosition.y === streetCorner.y) {
    console.log(`Pedestrian ${pedestrian._id} reached the street corner.`);
    io.to(simulationType).emit('streetCornerReached', {
      pedestrianId: pedestrian._id,
      pedestrianName: pedestrian.name,
    });
  }

  if (nextPosition.x === centerLine.x && nextPosition.y === centerLine.y) {
    console.log(`Pedestrian ${pedestrian._id} reached the street corner.`);
    io.to(simulationType).emit('centerLineReached', {
      pedestrianId: pedestrian._id,
      pedestrianName: pedestrian.name,
    });
  }

  // CHECK IF THIS IS THE LAST COORDINATE IN THE PATH //
  if (nextIndex === path.length - 1) {
    console.log(`Pedestrian ${pedestrian._id} reached the end of its path.`);

    // INCREMENT SCORE BY 50 //
    pedestrian.score += 50;
    await pedestrian.save();

    // ALSO ADD 50 TO THE ASSOCIATED USER'S SCORE //
    if (pedestrian.student) {
      try {
        const student = await Student.findById(pedestrian.student);
        if (student) {
          student.score += 50;
          await student.save();
          console.log(`Updated Student ${student._id}'s score. New score: ${student.score}`);
        } else {
          console.warn(`Student with ID ${pedestrian.student} not found.`);
        }
      } catch (err) {
        console.error(`Error updating student score: ${err}`);
      }
    } else if (pedestrian.teacher) {
      try {
        const teacher = await Teacher.findById(pedestrian.teacher);
        if (teacher) {
          teacher.score += 50;
          await teacher.save();
          console.log(`Updated Teacher ${teacher._id}'s score. New score: ${teacher.score}`);
        } else {
          console.warn(`Teacher with ID ${pedestrian.teacher} not found.`);
        }
      } catch (err) {
        console.error(`Error updating teacher score: ${err}`);
      }
    } else {
      console.log(`Pedestrian ${pedestrian._id} is not associated with a student or a teacher.`);
    }

    // EMIT AN UPDATE TO ENSURE CLIENT KNOWS ABOUT THE NEW SCORE //
    io.to(simulationType).emit('updatePedestrian', {
      ...pedestrian.toObject(),
      simulationType,
    });

    // EMIT CROSSED STREET EVENT //
    io.to(simulationType).emit('crossedStreet', {
      pedestrianId: pedestrian._id,
      pedestrianName: pedestrian.name
    });
  }
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
  // streetCorner,
  initializePedestrian,
  updatePedestrianPosition,
  deletePedestrian,
};
