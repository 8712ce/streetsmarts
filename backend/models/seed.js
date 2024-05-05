const db = require('./')

const seed_paths = [
    {
        direction: "N_R",
        coordinates: [
            { x: 500, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "N_S",
        coordinates: [
            { x: 500, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "N_L",
        coordinates: [
            { x: 500, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "E_R",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "E_S",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "E_L",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "W_R",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "W_S",
        coordinates: [
            { x: 10, y: 10 },
            { x: 20, y: 15 },
            { x: 30, y: 20 }
        ]
    },
    {
        direction: "W_L",
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






db.Path.deleteMany({})
    .then(() => {
        console.log('Removed all Paths');

        db.Path.insertMany(seed_paths)
            .then(paths => {
                console.log('Created', paths.length, 'paths');
            })
            .catch(err => {
                console.log('Error occurred in insertMany', err);
            });
    })
    .catch(err => {
        console.log('Error occurred in deleteMany', err);
    });

    db.Vehicle.deleteMany({})
    .then(() => {
        console.log('Removed all Vehicles');

        db.Vehicle.insertMany(seed_vehicles)
            .then(vehicles => {
                console.log('Created', vehicles.length, 'vehicles');
            })
            .catch(err => {
                console.log('Error occurred in insertMany', err);
            });
    })
    .catch(err => {
        console.log('Error occurred in deleteMany', err);
    });


