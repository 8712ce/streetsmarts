// DEPENDENCIES //
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const passportConfig = require("./config/passport")();
require("dotenv").config();
const methodOverride = require("method-override");
const path = require("path");
// const router = express.Router();
const socket = require("./utils/socket");

const Pedestrian = require("./models/pedestrian");
const { updatePedestrianPosition, deletePedestrian } = require("./controllers/pedestrianService");
const Student = require("./models/student.js");
const Teacher = require("./models/teacher.js");
const reSeedSimData = require('./utils/reSeedSimData');


// ACCESS MODELS //
const db = require("./models");



// ACCESS CONTROLLERS //
const usersCtrl = require("./controllers/users.js");
const studentsCtrl = require("./controllers/students.js");
const teachersCtrl = require("./controllers/teachers.js");
const vehiclesCtrl = require("./controllers/vehicles.js");
const pedestriansCtrl = require("./controllers/pedestrians.js");

const vehicleService = require("./controllers/vehicleService.js");
const trafficSignalVehicleService = require("./controllers/trafficSignalVehicleService.js");



// CREATE EXPRESS APP //
const app = express();
const server = http.createServer(app);



// CORS CONFIGURATION SPECIFICALLY FOR SOCKET.IO //
const io = socket.init(server);



const { deleteVehicle } = require('./controllers/trafficSignalVehicleService.js');
const { occupiedCoordinates } = require("./utils/collisionUtils.js");


// MIDDLEWARE //

// CORS ALLOWS THE FRONTEND TO COMMUNICATE WITH THE BACKEND //
app.use(cors());



// BODY PARSER: USED FOR POST/PUT/PATCH ROUTES: THIS WILL TAKE INCOMING STRINGS FROM THE BODY THAT ARE URL ENCODED AND PARSE THEM INTO AN OBJECT THAT CAN BE ACCESSED IN TEH REQUEST PARAMETER AS A PROPERTY CALLED BODY. //
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passportConfig.initialize());



// SERVE STATIC ASSETS FROM THE 'ASSETS' DIRECTORY //
// app.use(express.static('assets'));


app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));



// ROUTES //
// ALL ROUTES AFFECTING THE ______ MODEL: THIS TELLS THE APP TO LOOK AT THE "CONTROLLERS/_____.JS" FILE TO HANDLE ALL ROUTES THAT BEGIN WITH "LOCALHOST:8000/______." //
app.use("/students", studentsCtrl)
app.use("/teachers", teachersCtrl)
app.use("/users", usersCtrl)
app.use("/vehicles", vehiclesCtrl)
app.use("/pedestrians", pedestriansCtrl);
// app.use("/paths", pathCoordinatesCtrl);

// app.set("io", io);




// ANY OTHER ROUTE NOT MATCHING THE ROUTES ABOVE GETS ROUTED BY REACT //
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});



// LISTENER //
const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`App is running at localhost:${port}`);
});



// === VEHICLE MANAGEMENT FUNCTIONS === //

// IN-MEMORY STORE TO KEEP TRACK OF ACTIVE VEHICLES //
const activeVehicles = new Map();



// FUNCTION TO REGISTER A VEHICLE //
const registerVehicle = (vehicle) => {
    activeVehicles.set(vehicle._id, vehicle);
    console.log(`Vehicle registered: ${vehicle._id}`);
};



// FUNCTION TO DEREGISTER A VEHICLE //
const deregisterVehicle = (vehicleId) => {
    activeVehicles.delete(vehicleId);
    console.log(`Vehicle deregistered: ${vehicleId}`);
};



// STORE THE NUMBER OF CONNECTED CLIENTS FOR EACH SIMULATION //
const simulationUsersCount = {
    trafficSignal: 0,
    stopSign: 0,
};


// Server-side code (server.js)
io.on("connection", (socket) => {
    console.log("New client connected. Socket ID:", socket.id);
    console.log(`Current number of connected clients: ${io.engine.clientsCount}`);

    // LISTEN FOR SIMULATION SELECTION FROM THE CLIENT //
    socket.on('joinSimulation', (simulationType) => {
        console.log(`Client ${socket.id} joined simulation: ${simulationType}`);

        // INCREMENT USER COUNT FOR THE SIMULATION //
        simulationUsersCount[simulationType]++;

        // START THE SIMULATION UPDATE LOOP IF IT'S THE FIRST USER //
        if (simulationUsersCount[simulationType] === 1) {
            if (simulationType === 'trafficSignal') {
                // PASS THE SIMULATION TYPE TO sstartTrafficSignalCycle //
                trafficSignalVehicleService.startTrafficSignalUpdateLoop(simulationType);
            } else if (simulationType === 'stopSign') {
                vehicleService.startStopSignUpdateLoop(simulationType);
            }
        }

        // STORE SIMULATION TYPE IN SOCKET INSTANCE FOR FUTURE REFERENCE //
        socket.simulationType = simulationType;

        // JOIN THE SIMULATION'S ROOM SO THAT WE CAN EMIT EVENTS SPECIFICALLY TO THIS SIMULATION //
        socket.join(simulationType);

        // SEND THE LIST OF ACTIVE VEHICLES FOR THE SIMULATION TO THE NEW CLIENT //
        const vehicles = Array.from(activeVehicles.values()).filter(vehicle => vehicle.simulationType === simulationType);
        socket.emit('currentVehicles', vehicles);
    });

    // // Send the list of active vehicles to the new client
    // socket.emit('currentVehicles', Array.from(activeVehicles.values()));

    // Log the listener count for each event
    console.log("Listener count for 'registerVehicle' before attaching listener:", socket.listenerCount('registerVehicle'));
    console.log("Listener count for 'deregisterVehicle' before attaching listener:", socket.listenerCount('deregisterVehicle'));
    console.log("Listener count for 'disconnect' before attaching listener:", socket.listenerCount('disconnect'));



    socket.on("registerVehicle", (vehicle) => {
        // Log the state of activeVehicles before registering the vehicle
        console.log("Current active vehicles before registration:", Array.from(activeVehicles.keys()));

        if (!activeVehicles.has(vehicle._id)) {
            registerVehicle(vehicle);
            console.log(`Vehicle ${vehicle._id} registered. Active vehicles:`, Array.from(activeVehicles.keys()));
        } else {
            console.log(`Vehicle ${vehicle._id} is already registered. Active vehicles:`, Array.from(activeVehicles.keys()));
            // Do not emit the event again if already registered
        }

        // Log the listener count after registering 'registerVehicle' event
        console.log("Listener count for 'registerVehicle' after attaching listener:", socket.listenerCount('registerVehicle'));
    });



    socket.on("deregisterVehicle", (vehicleId) => {
        console.log("Current active vehicles before deregistration:", Array.from(activeVehicles.keys()));

        if (activeVehicles.has(vehicleId)) {
            deregisterVehicle(vehicleId);
            deleteVehicle(vehicleId); // Clean up on the server-side
            console.log(`Vehicle ${vehicleId} deregistered. Active vehicles:`, Array.from(activeVehicles.keys()));
        } else {
            console.log(`Attempted to deregister a vehicle that is not registered: ${vehicleId}`);
        }

        // Log the listener count after deregistering 'deregisterVehicle' event
        console.log("Listener count for 'deregisterVehicle' after deregistration:", socket.listenerCount('deregisterVehicle'));
    });



    // MOVE PEDESTRAIN EVENT HANDLER //
    socket.on('movePedestrian', async ({ pedestrianId, direction, simulationType }) => {
        console.log(`Received movePedestrian event for ${pedestrianId} in simulation ${simulationType} moving ${direction}`);

        try {
            // FIND THE PEDESTRIAN BY ID //
            const pedestrian = await Pedestrian.findById(pedestrianId);

            if (!pedestrian) {
                console.error(`Pedestrian ${pedestrianId} not found.`);
                return;
            }

            // UPDATE THE PEDESTRIAN'S POSITION //
            await updatePedestrianPosition(pedestrian, direction, simulationType);
        } catch (err) {
            console.error('Error handling movePedestrian event:', err);
        }
    });



    // INCREASE SCORE EVENT HANDLER //
    socket.on('increaseScore', async ({ pedestrianId, simulationType, increment, studentId, teacherId }) => {
        try {
            // FIND THE PEDESTRIAN //
            const pedestrian = await Pedestrian.findById(pedestrianId);
            if (!pedestrian || pedestrian.simulationType !== simulationType) {
                console.warn(`Cannot increase score: Pedestrian ${pedestrianId} not found or wrong simulation.`);
                return;
            }

            // UPDATE THE PEDESTRAIN'S LOCAL (PER-SIMULATION) SCORE //
            pedestrian.score += increment;
            await pedestrian.save();

            // IF THERE'S A STUDENT ID, ALSO FIND THAT STUDENT AND UPDATE IT //
            if (studentId) {
                const student = await Student.findById(studentId);
                if (student) {
                    student.score += increment;
                    student.destinationScore += increment;
                    await student.save();
                    console.log(`Also increased Student ${studentId} total score by ${increment}. Now: ${student.score}.`);
                }
            }

            // IF THERE'S A TEACHER ID, ALSO FIND THAT TEACHER AND UPDATE IT //
            if (teacherId) {
                const teacher = await Teacher.findById(teacherId);
                if (teacher) {
                    teacher.score += increment;
                    teacher.destinationScore += increment;
                    await teacher.save();
                    console.log(`Also increased Teacher ${teacherId} total score by ${increment}.  Now: ${teacher.score}.`);
                }
            }

            const io = require('./utils/socket').getIo();
            io.to(simulationType).emit('updatePedestrian', {
                ...pedestrian.toObject(),
                simulationType,
            });
            console.log(`Increased score of pedestrian ${pedestrianId} by ${increment} points.`);
        } catch (err) {
            console.error('Error increasing score:', err);
        }
    });



    // HANDLE CLIENT DISCONNECTION //
    // socket.on("disconnect", () => {
    //     console.log("Client disconnected. Socket ID:", socket.id);

    //     const simulationType = socket.simulationType;

    //     if (simulationType) {
    //         // DECREMENT THE USER COUNT FOR THE SIMULATION //
    //         simulationUsersCount[simulationType] = Math.max(simulationUsersCount[simulationType] - 1, 0);

    //         // STOP THE SIMULATION UPDATE LOOP IF NO USERS ARE CONNECTED //
    //         if (simulationUsersCount[simulationType] === 0) {
    //             if (simulationType === 'trafficSignal') {
    //                 trafficSignalVehicleService.stopTrafficSignalUpdateLoop();
    //             } else if (simulationType === 'stopSign') {
    //                 vehicleService.stopStopSignUpdateLoop();
    //             }
    //         }
    //     }

    //     // Log the listener count after the disconnect event
    //     console.log("Listener count for 'disconnect' after disconnection:", socket.listenerCount('disconnect'));
    // });



    // socket.on('leaveSimulation', (simulationType) => {
    //     console.log(`Client ${socket._id} left simulation: ${simulationType}.`);

    //     // DECREMENT THE USER COUNT FOR THE SIMULATION //
    //     simulationUsersCount[simulationType] = Math.max(simulationUsersCount[simulationType] - 1, 0);

    //     // STOP THE SIMULATION UPDATE LOOP IF NO USERS ARE CONNECTED //
    //     if (simulationUsersCount[simulationType] === 0) {
    //         if (simulationType === 'trafficSignal') {
    //             trafficSignalVehicleService.stopTrafficSignalUpdateLoop();
    //         } else if (simulationType === 'stopSign') {
    //             vehicleService.stopStopSignUpdateLoop();
    //         }
    //     }
    // });

    const handleSimulationLeave = async (socket, simulationType) => {
        console.log(`Handling cleanup for simulation: ${simulationType}`);
        
        // DECREMENT THE USER COUNT FOR THE SIMULATION //
        simulationUsersCount[simulationType] = Math.max(simulationUsersCount[simulationType] - 1, 0);

        // CHECK IF THE SOCKET HAS AN ASSOCIATED PEDESTRIAN //
        const pedestrianId = socket.pedestrianId;
        if (pedestrianId) {
            try {
                await deletePedestrian(pedestrianId, simulationType);
                console.log(`Deleted pedestrian ${pedestrianId} from simulation ${simulationType}.`);
            } catch (err) {
                console.error(`Error deleting pedestrian ${pedestrianId}:`, err);
            }
        }
    
        // STOP THE SIMULATION UPDATE LOOP IF NO USERS ARE CONNECTED //
        if (simulationUsersCount[simulationType] === 0) {
            const occupancyMap = occupiedCoordinates[simulationType];
            if (occupancyMap) {
                occupancyMap.clear();
                console.log(`Cleared occupancy map for simulation ${simulationType}`);
            }

            if (simulationType === 'trafficSignal') {
                trafficSignalVehicleService.stopTrafficSignalUpdateLoop();
            } else if (simulationType === 'stopSign') {
                vehicleService.stopStopSignUpdateLoop();
            }

            console.log('Reseeding database...');
            await reSeedSimData();
            console.log('Database reseeded successfully.');
        }
    };
    
    // HANDLE CLIENT DISCONNECTIONS //
    socket.on("disconnect", () => {
        console.log("Client disconnected. Socket ID:", socket.id);
        if (socket.simulationType) {
            handleSimulationLeave(socket, socket.simulationType);
        }
    });
    
    // HANDLE LEAVE SIMULATION EVENT //
    socket.on('leaveSimulation', (simulationType) => {
        console.log(`Client ${socket.id} left simulation: ${simulationType}`);
        handleSimulationLeave(socket, simulationType);
    });
    
});



// module.exports = router;
module.exports = { app };