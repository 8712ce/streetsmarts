const express = require('express');
const router = express.Router();
const db = require('../models');
const jwt = require('jwt-simple');
const config = require('../config/config');
const passportConfig = require('../config/passport')();

// function passportConfig.authenticate()(req, res, next){
//     if(req.headers.authorization){
//         next()
//     } else {
//         res.sendStatus(401)
//     }
// }

// On front end we will send logged in teacher's ID as the req.body.teacher
// And could send level as teacher's level
router.post('/new', passportConfig.authenticate(), async (req, res) => {
    
    let newStudent = req.body
    const createdStudent = await db.Student.create(newStudent)
    res.json(createdStudent)
})





// Get all students
router.get('/', passportConfig.authenticate(), async (req, res) => {
    try {
        const allStudents = await db.Student.find({});
        res.json(allStudents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





// GET ALL STUDENTS BY TEACHER ID //
router.get('/teacher/:teacherId', passportConfig.authenticate(), async (req, res) => {
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
router.get('/:studentId', passportConfig.authenticate(), async (req,res) => {
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
router.get('/user/:userId', passportConfig.authenticate(), async (req, res) => {
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
router.put('/:studentId', passportConfig.authenticate(), async (req, res) => {
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

        if (req.body.screenName) {
            studentToUpdate.screenName = req.body.screenName;
        }

        if (req.body.score) {
            studentToUpdate.score = req.body.score;
        }

        if (req.body.destinationScore) {
            studentToUpdate.destinationScore = req.body.destinationScore;
        }

        if (req.body.teacher) {
            studentToUpdate.teacher = req.body.teacher;
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
router.delete('/:studentId', passportConfig.authenticate(), async (req, res) => {
    const studentId = req.params.studentId;

    try {
        // FIND THE STUDENT DOC //
        const studentToDelete = await db.Student.findById(studentId);
        if (!studentToDelete) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // CHECK IF THE USER IS TEH STUDENT THEMSELVES //
        const isStudentOwner = (req.user.id === studentToDelete.user.toString());
        if (isStudentOwner) {
            // STUDENT IS DELETING THEMSELF //
            await db.Student.findByIdAndDelete(studentId);
            await db.User.findByIdAndDelete(studentToDelete.user);
            return res.json({ message: 'Student (self) deleted successfully.' });
        }

        // IF NOT STUDENT, MAYBE IT'S THE TEACHER //
        // FIND THE TEACHER DOC WHOSE .USER IS REQ.USER.ID //
        const teacherDoc = await db.Teacher.findOne({ user: req.user.id });
        if (!teacherDoc) {
            // THE LOGGED-IN USER IS NOT A TEACHER OR ISN'T FOUND //
            return res.status(403).json({ error: 'Unauthorized: Only the student or the assigned teacher can delete this student.' });
        }

        // CHECK IF THIS TEACHERDOC._ID === THE STUDENT'S TEACHER FIELD //
        if (teacherDoc._id.toString() !== studentToDelete.teacher.toString()) {
            return res.status(403).json({ error: 'Unauthorized: You are not the assigned teacher for this student.' });
        }

        // IF WE GET HERE, THE TEACHER IS AUTHORIZED TO DELETE THE STUDENT //
        await db.Student.findByIdAndDelete(studentId);
        await db.User.findByIdAndDelete(studentToDelete.user);

        return res.json({ message: 'Student (by teacher) deleted successfully.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error.' });
    }
});



module.exports = router;