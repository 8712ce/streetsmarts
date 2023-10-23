const express = require('express')
const router = express.Router()
const db = require('../models')
const jwt = require('jwt-simple')
const config = require('../config.js/config')

function isAuthenticated(req, res, next){
    if(req.headers.authorization){
        next()
    } else {
        res.sendStatus(401)
    }
}

// SIGN UP ROUTE (create user)
router.post('/signup', (req, res) => {
    // verify the request body has an email and password
    if (req.body.email && req.body.password) {
        // make a newUser object with the request body and password
        let newUser = {
            email: req.body.email,
            password: req.body.password
        }
        // check if a user exists with the same email and password
        db.User.findOne({ email: req.body.email })
            .then((user) => {
                // if a user doesn't exist...
                if (!user) {
                    // ...create a new one.
                    db.User.create(newUser)
                        .then(user => {
                            // if the database creates a user successfully, assign a JWT to the user and send the JWT as the response
                            if (user) {
                                const payload = {
                                    id: newUser.id
                                }
                                const token = jwt.encode(payload, config.jwtSecret)
                                res.json({
                                    token: token
                                })
                                // send an error if the database fails to create a user
                            } else {
                                res.sendStatus(401)
                            }
                        })
                    // send an error if the user already exists
                } else {
                    res.sendStatus(401)
                }
            })
        // send an error if the request body does not have an email and password
    } else {
        res.sendStatus(401)
    }
})


  
router.post('/login', async (req, res) => {
    // attempt to find the user by their email in the database
    const foundUser = await db.User.findOne({ email: req.body.email })
    // check to:
    // 1. make sure the user was found in the database
    // 2. make sure the user entered in the correct password
    if (foundUser && foundUser.password === req.body.password) {
        // if the above applies, send the JWT to the browser
        const payload = { id: foundUser.id }
        const token = jwt.encode(payload, config.jwtSecret)
        res.json({
            token: token,
            user: foundUser
        })
        // if the user was not found in the database OR their password was incorrect, send an error
    } else {
        res.sendStatus(401)
    }
})





module.exports = router;