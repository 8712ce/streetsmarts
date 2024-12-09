const socket = require('../utils/socket');

// OCCUPANCY MAP TO TRACK OCCUPIED COORDINATES //
const occupiedCoordinates = {
    stopSign: new Map(),
    trafficSignal: new Map()
};

// FUNCTION TO ADD AN OCCUPANT TO THE OCCUPANCY MAP //
function addOccupant(simulationType, coordKey, occupantInfo) {
    const occupancyMap = occupiedCoordinates[simulationType];
    occupancyMap.set(coordKey, occupantInfo);
}

// FUNCTION OT REMOVE AN OCCUPANT FROM THE OCCUPANCY MAP //
function removeOccupant(simulationType, coordKey, entityId) {
    const occupancyMap = occupiedCoordinates[simulationType];
    const occupant = occupancyMap.get(coordKey);
    if (occupant && occupant.entityId.toString() === entityId.toString()) {
        occupancyMap.delete(coordKey);
    }
}

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



// FUNCTION TO CHECK IF COORDINATE IS PART OF THE INTERSECTION
const isIntersectionCoordinate = (coordinate) => {
    return intersectionCoordinates.some(
        intersectionCoord => intersectionCoord.x === coordinate.x && intersectionCoord.y === coordinate.y
    );
};



// FUNCTION TO CHECK IF INTERSECTION IS OCCUPIED
const isIntersectionOccupied = (simulationType, excludeCoordKeys = []) => {
    const occupancyMap = occupiedCoordinates[simulationType];
    const occupied = intersectionCoordinates.filter(coord => {
        const coordKey = `${coord.x},${coord.y}`;
        const isOccupied = occupancyMap.has(coordKey);
        const isExcluded = excludeCoordKeys.includes(coordKey);
        return isOccupied && !isExcluded;
    });

    if (occupied.length > 0) {
        console.log(
            `Intersection is occupied in ${simulationType} simulation at coordinates: ${occupied
                .map(c => `(${c.x}, ${c.y})`)
                .join(', ')}`
        );
        return true;
    } else {
        // console.log('Intersection is not occupied.');
        return false;
    }
};



// STOP SIGN SIMULATION LOGIC //
// STOP SIGN COORDINATES //
const stopSignCoordinates = [
    { x: 41, y: 77.5 },
    { x: 27.3, y: 66.7 },
    { x: 36.6, y: 53.5 },
    { x: 48.3, y: 59.5 }
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



//TRAFFIC SIGNAL SIMULATION LOGIC //
// TRAFFIC SIGNAL COORDINATES //
const trafficSignalCoordinates = [
    { x: 41, y: 77.5 },
    { x: 27.3, y: 66.7 },
    { x: 36.6, y: 53.5 },
    { x: 48.3, y: 59.5 }
];



// INITIALIZE TRAFFIC SIGNAL STATES //
const trafficSignalStates = {
    northbound: 'green',
    eastbound: 'red',
    southbound: 'green',
    westbound: 'red'
};



// DEFINE CONSTANTS FOR LIGHT DURATION //
const GREEN_DURATION = 10000;
const YELLOW_DURATION = 3000;



// FUNCTION TO CYCLE TRAFFIC SIGNALS //
function cycleTrafficSignals() {
    const io = socket.getIo();

    // LOGIC TO SWITCH TRAFFIC SIGNAL STATES //
    if (trafficSignalStates.northbound === 'green') {
        // TRANSITION TO YELLOW //
        trafficSignalStates.northbound = 'yellow';
        trafficSignalStates.southbound = 'yellow';

        // EMIT UPDATE TO CLIENTS //
        // io.emit('trafficSignalUpdate', { ...trafficSignalStates });
        io.to(simulationType).emit('trafficSignalUpdate', { ...trafficSignalStates });


        setTimeout(() => {
            // SWITCH TO RED AND CHANGE OPPOSING LIGHTS TO GREEN //
            trafficSignalStates.northbound = 'red';
            trafficSignalStates.southbound = 'red';
            trafficSignalStates.eastbound = 'green';
            trafficSignalStates.westbound = 'green';

            // EMIT UPDATE TO CLIENTS //
            // io.emit('trafficSignalUpdate', { ...trafficSignalStates });
            io.to(simulationType).emit('trafficSignalUpdate', { ...trafficSignalStates });
        }, YELLOW_DURATION);
    } else if (trafficSignalStates.eastbound === 'green') {
        // REPEAT LOGIC FOR EASTBOUND AND WESTBOUND //
        trafficSignalStates.eastbound = 'yellow';
        trafficSignalStates.westbound = 'yellow';

        // EMIT UPDATE TO CLIENTS //
        // io.emit('trafficSignalUpdate', { ...trafficSignalStates });
        io.to(simulationType).emit('trafficSignalUpdate', { ...trafficSignalStates });

        setTimeout(() => {
            trafficSignalStates.eastbound = 'red';
            trafficSignalStates.westbound = 'red';
            trafficSignalStates.northbound = 'green';
            trafficSignalStates.southbound = 'green';

            // EMIT UPDATE TO CLIENTS //
            // io.emit('trafficSignalUpdate', { ...trafficSignalStates });
            io.to(simulationType).emit('trafficSignalUpdate', { ...trafficSignalStates });
        }, YELLOW_DURATION);
    }
}



// TIMER FOR CYCLING TRAFFIC SIGNALS //
let trafficSignalTimer = null;

function startTrafficSignalCycle() {
    if (!trafficSignalTimer) {
        trafficSignalTimer = setInterval(cycleTrafficSignals, GREEN_DURATION + YELLOW_DURATION);
        console.log('Traffic signal cycle started.');
    }
}



function stopTrafficSignalCycle() {
    if (trafficSignalTimer) {
        clearInterval(trafficSignalTimer);
        trafficSignalTimer = null;
        console.log('Traffic signal cycle stopped.');
    }
}



// FUNCTION TO GET TRAFFIC SIGNAL STATE FOR A DIRECTION //
function getTrafficSignalState(direction) {
    return trafficSignalStates[direction];
}



// FUNCTION TO CHECK IF COORDINATE IS A TRAFFIC SIGNAL COORDINATE //
const isTrafficSignalCoordinate = (coordinate) => {
    return trafficSignalCoordinates.some(
        singalCoord => singalCoord.x === coordinate.x && singalCoord.y === coordinate.y
    );
};


module.exports = {
    // SHARED //
    occupiedCoordinates,
    intersectionCoordinates,
    isIntersectionCoordinate,
    isIntersectionOccupied,
    addOccupant,
    removeOccupant,

    //STOP SIGN SIMULATION //
    stopSignCoordinates,
    stopSignQueues,
    isStopSignCoordinate,

    // TRAFFIC SIGNAL SIMULATION //
    trafficSignalCoordinates,
    trafficSignalStates,
    getTrafficSignalState,
    isTrafficSignalCoordinate,
    startTrafficSignalCycle,
    stopTrafficSignalCycle,
    GREEN_DURATION,
    YELLOW_DURATION
};
