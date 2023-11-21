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
    if (req.body.email && req.body.password) {
        let newUser = {
            email: req.body.email,
            password: req.body.password
        };

        db.User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    db.User.create(newUser)
                        .then(createdUser => {
                            if (createdUser) {
                                const payload = {
                                    id: createdUser.id
                                };
                                const token = jwt.encode(payload, config.jwtSecret);
                                res.json({
                                    user: createdUser,
                                    token: token
                                });
                            } else {
                                res.sendStatus(401);
                            }
                        })
                        .catch(createError => {
                            console.error(createError);
                            res.sendStatus(500);
                        });
                } else {
                    res.sendStatus(401);
                }
            })
            .catch(findError => {
                console.error(findError);
                res.sendStatus(500);
            });
    } else {
        res.sendStatus(401);
    }
});


  
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