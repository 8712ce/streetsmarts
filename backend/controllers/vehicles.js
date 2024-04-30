const express = require('express')
const router = express.Router()
const db = require('../models')
// const config = require('../config.js/config')

// CREATE (POST) ROUTE:

// DELETE ROUTE //
router.delete('/:id', (req, res) => {
    db.Vehicle.findByIdAndRemove(req.params.id, (err, vehicle) => {
        // res.redirect('/')
    })
})

module.exports = router;