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




// GET ALL STUDENTS BY TEACHER ID //
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



// GET STUDENT DOC BY USER ID //
router.get('/user/:userId', isAuthenticated, async (req, res) => {
    try {
        // FIND THE STUDENT DOC WHOSE USER FIELD MATCHES THE GIVEN USER ID //
        const studentDoc = await db.Student.findOne({ user: req.params.userId });
        if (!studentDoc) {
            return res.status(404).json({ error: 'Student not found for given userId' });
        }
        res.json(studentDoc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Update student by ID - Works in Postman
router.put('/:studentId', isAuthenticated, async (req, res) => {
    const studentId = req.params.studentId;

    try {
        // Find the student by ID
        const studentToUpdate = await db.Student.findById(studentId);

        if (!studentToUpdate) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Update properties if provided in the request body
        if (req.body.firstName) {
            studentToUpdate.firstName = req.body.firstName;
        }

        if (req.body.lastName){
            studentToUpdate.lastName = req.body.lastName
        }

        if (req.body.level) {
            studentToUpdate.level = req.body.level;
        }

        // Save the updated student
        const updatedStudent = await studentToUpdate.save();

        res.json(updatedStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Delete student by ID
router.delete('/:studentId', isAuthenticated, async (req, res) => {
    const studentId = req.params.studentId;
    
    try {
        // Find the student by ID
        const studentToDelete = await db.Student.findById(studentId);

        if (!studentToDelete) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Check if the authenticated teacher is the same as the teacher associated with the student
        if (req.body.teacherId !== studentToDelete.teacher.toString()) {
            return res.status(403).json({ error: 'Unauthorized: You do not have permission to delete this student' });
        }

        // Use findByIdAndDelete to directly delete the student by ID
        const deletedStudent = await db.Student.findByIdAndDelete(studentId);

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;