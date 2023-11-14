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
    let newStudent = {
        name: req.body.name,
        teacher: req.body.teacher,
        level:req.body.level
    }
    const createdStudent = await db.Student.create(newStudent)
    res.json(newStudent)
})


module.exports = router;