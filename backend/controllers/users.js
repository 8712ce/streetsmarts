const express = require('express')
const router = express.Router()
const db = require('../models')
const jwt = require('jwt-simple')
const config = require('../config/config')
const bcrypt = require('bcrypt');
const passport = require('../config/passport')

// Packages to look into: nodemailer and jsonwebtoken

// function isAuthenticated(req, res, next){
//     if(req.headers.authorization){
//         next()
//     } else {
//         res.sendStatus(401)
//     }
// }

// SIGN UP //
router.post('/signup', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (email && password && role) {
            const existingUser = await db.User.findOne({ email });

            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = {
                    email,
                    password: hashedPassword,
                    role
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
            res.status(401).json({ error: 'Email, password, and role are required' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// LOG IN //
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundUser = await db.User.findOne({ email });

        if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
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



router.put('/:userId', passportConfig.authenticate(), async (req, res) => {
    const userId = req.params.userId;
    const { email, password } = req.body;

    try {
        // FETCH USER //
        const user = await db.User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // CHECK IF THE REQUESTOR HAS PERMISSION TO UPDATE //
        // if (req.user.id !== userId) => 403

        // UPDATE EMAIL IF PROVIDED //
        if (email) {
            user.email = email;
        }
        // UPDATE PASSWORD IF PROVIDED //
        if (password && password.trim().length > 0) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword
        }

        await user.save();

        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// GET ROUTE FOR FETCHING A SINGLE USER DOC //
router.get('/:userId', passportConfig.authenticate(), async (req, res) => {
    const userId = req.params.userId;
    try {
        const foundUser = await db.User.findById(userId);
        if (!foundUser) {
            return rse.status(404).json({ error: 'User not found' });
        }

        // OPTIONAL AUTH CHECK: if (req.user.id !== userId)...

        res.json(foundUser);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching user' });
    }
});







module.exports = router;