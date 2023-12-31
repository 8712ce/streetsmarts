const express = require('express')
const router = express.Router()
const db = require('../models')
const jwt = require('jwt-simple')
const config = require('../config.js/config')
const bcrypt = require('bcrypt');

// Packages to look into: nodemailer and jsonwebtoken

function isAuthenticated(req, res, next){
    if(req.headers.authorization){
        next()
    } else {
        res.sendStatus(401)
    }
}

router.post('/signup', async (req, res) => {
    try {
        if (req.body.email && req.body.password) {
            const existingUser = await db.User.findOne({ email: req.body.email });

            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const newUser = {
                    email: req.body.email,
                    password: hashedPassword,
                };

                const createdUser = await db.User.create(newUser);
                const payload = { id: createdUser.id };
                const token = jwt.encode(payload, config.jwtSecret);
                res.json({
                    user: createdUser,
                    token: token,
                });
            } else {
                res.status(401).json({ error: 'Email already exists' });
            }
        } else {
            res.status(401).json({ error: 'Email and password are required' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const foundUser = await db.User.findOne({ email: req.body.email });

        if (foundUser && (await bcrypt.compare(req.body.password, foundUser.password))) {
            const payload = { id: foundUser.id };
            const token = jwt.encode(payload, config.jwtSecret);
            res.json({
                token: token,
                user: foundUser,
            });
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});







module.exports = router;