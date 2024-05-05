const db = require('./')

const seed_paths = [
    // {
    //     direction: "N_R",
    //     coordinates: [
    //         { x: 500, y: 10 },
    //         { x: 20, y: 15 },
    //         { x: 30, y: 20 }
    //     ]
    // },
    // {
    //     direction: "N_S",
    //     coordinates: [
    //         { x: 500, y: 10 },
    //         { x: 20, y: 15 },
    //         { x: 30, y: 20 }
    //     ]
    // },
    // {
    //     direction: "N_L",
    //     coordinates: [
    //         { x: 500, y: 10 },
    //         { x: 20, y: 15 },
    //         { x: 30, y: 20 }
    //     ]
    // },
    {
        direction: "S_R",
        coordinates: [
            { x: 500, y: 10 },
            { x: 500, y: 300 },
            { x: 10, y: 20 }
        ]
    },
    {
        direction: "S_S",
        coordinates: [
            { x: 500, y: 10 },
            { x: 500, y: 300 },
            { x: 1000, y: 20 }
        ]
    },
    {
        direction: "S_L",
        coordinates: [
            { x: 500, y: 10 },
            { x: 500, y: 300 },
            { x: 1000, y: 300 }
        ]
    },
    // {
    //     direction: "E_R",
    //     coordinates: [
    //         { x: 10, y: 10 },
    //         { x: 20, y: 15 },
    //         { x: 30, y: 20 }
    //     ]
    // },
    // {
    //     direction: "E_S",
    //     coordinates: [
    //         { x: 10, y: 10 },
    //         { x: 20, y: 15 },
    //         { x: 30, y: 20 }
    //     ]
    // },
    // {
    //     direction: "E_L",
    //     coordinates: [
    //         { x: 10, y: 10 },
    //         { x: 20, y: 15 },
    //         { x: 30, y: 20 }
    //     ]
    // },
    // {
    //     direction: "W_R",
    //     coordinates: [
    //         { x: 10, y: 10 },
    //         { x: 20, y: 15 },
    //         { x: 30, y: 20 }
    //     ]
    // },
    // {
    //     direction: "W_S",
    //     coordinates: [
    //         { x: 10, y: 10 },
    //         { x: 20, y: 15 },
    //         { x: 30, y: 20 }
    //     ]
    // },
    // {
    //     direction: "W_L",
    //     coordinates: [
    //         { x: 10, y: 10 },
    //         { x: 20, y: 15 },
    //         { x: 30, y: 20 }
    //     ]
    // }
]

const seed_vehicles = [
    {
        type: "Car",
        damage: 90,
        image: "Coming Soon",
        path: null
    },
    {
        type: "Small Truck",
        damage: 90,
        image: "Coming Soon",
        path: null
    },
    {
        type: "Large Truck",
        damage: 100,
        image: "Coming Soon",
        path: null
    },
    {
        type: "Motorcycle",
        damage: 50,
        image: "Coming Soon",
        path: null
    },
    {
        type: "Bus",
        damage: 100,
        image: "Coming Soon",
        path: null
    }
]


// db.Path.deleteMany({})
//     .then(() => {
//         console.log('Removed all Paths')

//         db.Path.insertMany(seed_paths, (err, paths) => {
//             if (err) {
//                 console.log('Error occured in insertMany', err)
//             } else {
//                 console.log('Created', paths.length, 'paths')
//             }
//         })
//     })
//     .catch(err => {
//         console.log('Error occured in remove', err)
//     });



db.Path.deleteMany({}, (err, paths) => {
    if (err) {
        console.log('Error occured in remove', err)
    } else {
        console.log('Removed all Paths')

        db.Path.insertMany(seed_paths, (err, paths) => {
            if (err) {
                console.log('Error occured in insertMany', err)
            } else {
                console.log('Created', paths.length, 'paths')
            }
        })
    }
})



// db.Vehicle.deleteMany({})
//     .then(() => {
//         console.log('Removed all Vehicles')

//         db.Vehicle.insertMany(seed_vehicles, (err, vehicles) => {
//             if (err) {
//                 console.log('Error occured in insertMany', err)
//             } else {
//                 console.log('Created', vehicles.length, 'vehicles')
//             }
//         })
//     })
//     .catch(err => {
//         console.log('Error occured in remove', err)
//     })



db.Vehicle.deleteMany({}, (err, vehicles) => {
    if (err) {
        console.log('Error occured in remove', err)
    } else {
        console.log('Removed all Vehicles')

        db.Vehicle.insertMany(seed_vehicles, (err, vehicles) => {
            if (err) {
                console.log('Error occured in insertMany', err)
            } else {
                console.log('Created', vehicles.length, 'vehicles')
            }
        })
    }
})