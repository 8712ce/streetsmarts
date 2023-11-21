const express = require('express');
const router = express.Router();
const db = require('../models');
const jwt = require('jwt-simple');
const config = require('../config.js/config');

function isAuthenticated(req, res, next) {
    if (req.headers.authorization) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// On the front end, send the logged-in teacher's ID as req.body.user
router.post('/new', isAuthenticated, async (req, res) => {
    console.log(req.headers.authorization);
    const newTeacher = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        user: req.body.user,
    };
    try {
        const createdTeacher = await db.Teacher.create(newTeacher);
        res.json(createdTeacher);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all teachers
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const allTeachers = await db.Teacher.find({});
        res.json(allTeachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get teacher by ID
router.get('/:teacherId', isAuthenticated, async (req, res) => {
    const teacherId = req.params.teacherId;
    try {
        const foundTeacher = await db.Teacher.findById(teacherId);
        if (!foundTeacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        res.json(foundTeacher);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
