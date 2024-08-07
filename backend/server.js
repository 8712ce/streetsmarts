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
const io = socketIo(server);



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



// SET UP THE SOCKET.IO CONNECTION HANDLER //
io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});


// module.exports = router;
module.exports = { app, io };