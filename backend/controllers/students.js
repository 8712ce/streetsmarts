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

// On front end we will send logged in teacher's ID as the req.body.teacher
// And could send level as teacher's level
router.post('/new', isAuthenticated, async (req, res) => {
    console.log(req.headers.authorization)
    let newStudent = req.body
    const createdStudent = await db.Student.create(newStudent)
    res.json(createdStudent)
})

// Get all students

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const allStudents = await db.Student.find({});
        res.json(allStudents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Get all students by teacher ID - Works in Postman
router.get('/teacher/:teacherId', isAuthenticated, async (req, res) => {
    const teacherId = req.params.teacherId;
    try {
        const studentsByTeacher = await db.Student.find({ teacher: teacherId });
        res.json(studentsByTeacher);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Student by ID - Works in Postman
router.get('/:studentId', isAuthenticated, async (req,res) => {
    const studentId = req.params.studentId;
    try {
        const foundStudent = await db.Student.findById(studentId);
        res.json(foundStudent)
    } catch (error) {
        console.error(error);
        res.status(500).json( {error: 'Internal Server Error'});
    }
})

module.exports = router;