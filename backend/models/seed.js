const db = require('./')

const seed_paths = [
    {
        direction: "NB_R",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "NB_S",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "NB_L",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "SB_R",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "SB_S",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "SB_L",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "EB_R",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "EB_S",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "EB_L",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "WB_R",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "WB_S",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "WB_L",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    }
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