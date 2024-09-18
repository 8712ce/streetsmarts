// DEPENDENCIES //
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const passport = require("./config.js/passport")();
require("dotenv").config();
const methodOverride = require("method-override");
const path = require("path");
// const router = express.Router();

// IMPORT VEHICLE SERVICE FUNCTIONS //
const { moveVehicle, deleteVehicle } = require('./controllers/vehicleService.js');



// ACCESS MODELS //
const db = require("./models");



// ACCESS CONTROLLERS //
const usersCtrl = require("./controllers/users.js");
const studentsCtrl = require("./controllers/students.js");
const teachersCtrl = require("./controllers/teachers.js");
const vehiclesCtrl = require("./controllers/vehicles.js");
const pathCoordinatesCtrl = require('./controllers/testPath.js');



// CREATE EXPRESS APP //
const app = express();
const server = http.createServer(app);



// CORS CONFIGURATION SPECIFICALLY FOR SOCKET.IO //
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000', // ALLOW REQUESTS FROM THE FRONTEND RUNNING ON THIS ORIGIN //
        methods: ['GET', 'POST'], // ALLOW THESE HTTP METHODS //
        allowedHeaders: ['Content-Type'], // ALLOW THESE HEADERS //
        credentials: true, // ALLOW COOKIES AND OTHER CREDENTIALS TO BE SENT //
    },
});



// MIDDLEWARE //

// CORS ALLOWS THE FRONTEND TO COMMUNICATE WITH THE BACKEND //
app.use(cors());



// BODY PARSER: USED FOR POST/PUT/PATCH ROUTES: THIS WILL TAKE INCOMING STRINGS FROM THE BODY THAT ARE URL ENCODED AND PARSE THEM INTO AN OBJECT THAT CAN BE ACCESSED IN TEH REQUEST PARAMETER AS A PROPERTY CALLED BODY. //
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());



// SERVE STATIC ASSETS FROM THE 'ASSETS' DIRECTORY //
// app.use(express.static('assets'));


app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));



// ROUTES //
// ALL ROUTES AFFECTING THE ______ MODEL: THIS TELLS THE APP TO LOOK AT THE "CONTROLLERS/_____.JS" FILE TO HANDLE ALL ROUTES THAT BEGIN WITH "LOCALHOST:8000/______." //
app.use("/students", studentsCtrl)
app.use("/teachers", teachersCtrl)
app.use("/users", usersCtrl)
app.use("/vehicles", vehiclesCtrl)
app.use("/paths", pathCoordinatesCtrl);

// app.set("io", io);




// ANY OTHER ROUTE NOT MATCHING THE ROUTES ABOVE GETS ROUTED BY REACT //
// app.get("*", (req, res) => {
//     res.sendFile(path.join(path.dirname(__dirname), "frontend", "build", "index.html"));
// });
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});



// LISTENER //
// app.listen(process.env.PORT, () => {
//     console.log(`App is running at localhost:${process.env.PORT}`)
// });
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


// Server-side code (server.js)
io.on("connection", (socket) => {
    console.log("New client connected. Socket ID:", socket.id);
    console.log(`Current number of connected clients: ${io.engine.clientsCount}`);

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

            // // Emit event only once when a vehicle is registered
            // io.emit('newVehicle', vehicle);
            // console.log('newVehicle event emitted for vehicle ID:', vehicle._id);

            // Start moving the vehicle if needed
            moveVehicle(vehicle._id);
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
            io.emit('vehicleDeregistered', vehicleId);
            console.log(`Vehicle ${vehicleId} deregistered. Active vehicles:`, Array.from(activeVehicles.keys()));
        } else {
            console.log(`Attempted to deregister a vehicle that is not registered: ${vehicleId}`);
        }

        // Log the listener count after deregistering 'deregisterVehicle' event
        console.log("Listener count for 'deregisterVehicle' after deregistration:", socket.listenerCount('deregisterVehicle'));
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected. Socket ID:", socket.id);

        // Log the listener count after the disconnect event
        console.log("Listener count for 'disconnect' after disconnection:", socket.listenerCount('disconnect'));
    });
});







// module.exports = router;
module.exports = { app, io };