const express = require('express');
const router = express.Router();
const db = require('../models');
// const config = require('../config.js/config');
const Vehicle = require('../models/vehicle');
const Path = require('../models/path');


// ROUTE TO FETCH A RANDOM VEHICLE WITH A RANDOM PATH //
router.get('/random', async (req, res) => {
    try {
        // FETCH A RANDOM VEHICLE //
        let randomVehicle = await Vehicle.aggregate([{ $sample: { size: 1 } }]);
        console.log(randomVehicle)
        // IF THE PATH OF THE RANDOM BEHICLE IS NULL, REPLACE IT WITH A RANDOM PATH //
        if (randomVehicle[0].path === null) {
            const randomPath = await Path.aggregate([{ $sample: { size: 1 } }]);
            console.log(randomPath)
            randomVehicle[0].path = randomPath[0].coordinates; // ASSUMING PATH IS STORED AS AN OBJECTID //
        }

        res.json(randomVehicle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});



// // CREATE (POST) ROUTE: THIS ROUTE RECEIVES THE POST REQUEST SENT FROM THE "NEW" ROUTE ABOVE, PARSES IT INTO A VEHICLE OBJECT, CREATES THE VEHICLE OBJECT AS A DOCUMENT IN THE VEHICLES COLLECTION. //
// router.post('/', (req, res) => {
//     db.Vehicle.create(req.body, (err, vehicle) => {
//         // res.redirect('/vehicles/show/' + vehicle._id)
//     })
// })



// // SHOW (GET/READ) ROUTE:  THIS ROUTE WILL SHOW AN INDIVIDUAL MOVIE DOCUMENT USING THE URL PARAMETER (WHICH WILL ALWAYS BE THE MOVIE DOCUMENT'S ID). //
// router.get('/show/:id', (req, res) => {
//     db.Vehicle.findById(req.params.id, (err, vehicle) => {
//         res.render("showVehicle", {
//             vehicle: vehicle
//         })
//     })
// })


// // ROUTE TO FETCH A RANDOM VEHICLE WITH A RANDOM PATH AND SAVE TO DATABASE //
// router.post('/random', async (req, res) => {
//     try {
//         // FETCH A RANDOM VEHICLE //
//         let randomVehicle = await Vehicle.aggregate([{ $sample: { size: 1 } }]);
//         console.log(randomVehicle)
        
//         // IF THE PATH OF THE RANDOM VEHICLE IS NULL, REPLACE IT WITH A RANDOM PATH //
//         if (randomVehicle[0].path === null) {
//             const randomPath = await Path.aggregate([{ $sample: { size: 1 } }]);
//             randomVehicle[0].path = randomPath[0].coordinates; // ASSUMING PATH IS STORED AS AN OBJECTID //
//         }

//         // CREATE THE RANDOM VEHICLE IN THE DATABASE //
//         const createdVehicle = await Vehicle.create(randomVehicle[0]);

//         // RETURN THE CREATED VEHICLE AS JSON RESPONSE //
//         res.json(createdVehicle);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });




// DELETE ROUTE //
router.delete('/:id', (req, res) => {
    db.Vehicle.findByIdAndRemove(req.params.id, (err, vehicle) => {
        // res.redirect('/')
    })
})

module.exports = router;


// // ROUTE TO FETCH A RANDOM VEHICLE OR A SPECIFIC VEHICLE BY ID //
// router.get('/vehicle/:id?', async (req, res) => {
//     try {
//         if (req.params.id) {
//             // If ID parameter is provided, fetch the specific vehicle
//             const vehicle = await Vehicle.findById(req.params.id);
//             if (!vehicle) {
//                 return res.status(404).json({ message: 'Vehicle not found' });
//             }
//             return res.json(vehicle);
//         } else {
//             // If no ID parameter is provided, fetch a random vehicle with a random path
//             let randomVehicle = await Vehicle.aggregate([{ $sample: { size: 1 } }]);
//             console.log(randomVehicle)
//             // IF THE PATH OF THE RANDOM BEHICLE IS NULL, REPLACE IT WITH A RANDOM PATH //
//             if (randomVehicle[0].path === null) {
//                 const randomPath = await Path.aggregate([{ $sample: { size: 1 } }]);
//                 randomVehicle[0].path = randomPath[0].coordinates; // Assuming path is stored as an ObjectId
//             }
//             return res.json(randomVehicle);
//         }
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Server Error' });
//     }
// });