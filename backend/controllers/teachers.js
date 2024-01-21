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
    const newTeacher = req.body;
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

// Get teacher by ID - works in postman
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

// update one teacher
// Update teacher by ID
router.put('/:teacherId', isAuthenticated, async (req, res) => {
    const teacherId = req.params.teacherId;

    try {
        // Find the teacher by ID
        const teacherToUpdate = await db.Teacher.findById(teacherId);

        if (!teacherToUpdate) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Update properties if provided in the request body
        if (req.body.firstName) {
            teacherToUpdate.firstName = req.body.firstName;
        }

        if (req.body.lastName) {
            teacherToUpdate.lastName = req.body.lastName;
        }

        // Save the updated teacher
        const updatedTeacher = await teacherToUpdate.save();

        res.json(updatedTeacher);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:teacherId', isAuthenticated, async (req, res) => {
    const teacherId = req.params.teacherId;

    try {
        // Find the teacher by ID
        const teacherToDelete = await db.Teacher.findById(teacherId);

        if (!teacherToDelete) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Check if the authenticated user has the same ID as the teacher to be deleted
        if (req.user.id !== teacherToDelete.user.toString()) {
            return res.status(403).json({ error: 'Unauthorized: You do not have permission to delete this teacher' });
        }

        // Use findByIdAndDelete to directly delete the teacher by ID
        await db.Teacher.findByIdAndDelete(teacherId);

        res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
