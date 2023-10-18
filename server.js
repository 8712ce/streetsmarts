// DEPENDENCIES //
const express = require("express")
const app = express()
const cors = require("cors")
const passport = require("./config/passport")()
require("dotenv").config.env.PORT
const methodOverride = require("method-override");
const path = require("path")

// ACCESS MODELS //
const db = require("./models")

// ACCESS CONTROLLERS //
const usersCtrl = require("./controllers/users")



// MIDDLEWARE //

// CORS ALLOWS THE FRONTEND TO COMMUNICATE WITH THE BACKEND //
app.use(cors())

// BODY PARSER: USED FOR POST/PUT/PATCH ROUTES: THIS WILL TAKE INCOMING STRINGS FROM THE BODY THAT ARE URL ENCODED AND PARSE THEM INTO AN OBJECT THAT CAN BE ACCESSED IN TEH REQUEST PARAMETER AS A PROPERTY CALLED BODY. //
app.use(express.urlencoded({ extended: true }));

app.use(express.json())
app.use(passport.initialize())



// ROUTES //
// ALL ROUTES AFFECTING THE ______ MODEL: THIS TELLS THE APP TO LOOK AT THE "CONTROLLERS/_____.JS" FILE TO HANDLE ALL ROUTES THAT BEGIN WITH "LOCALHOST:8000/______." //
app.use("/users", usersCtrl)

// ANY OTHER ROUTE NOT MATCHING THE ROUTES ABOVE GETS ROUTED BY REACT //
app.get("*", (req, res) => {
    res.sendFile(path.join(path.dirname(__dirname), "frontend", "build", "index.html"));
})



// LISTENER //
app.listen(process.env.PORT, () => {
    console.log(`App is running at localhost:${process.env.PORT}`)
})