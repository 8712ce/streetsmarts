const db = require('./')

const seed_paths = [
    {
        direction: "N_R",
        coordinates: [
            { x: 520, y: 500 },
            { x: 520, y: 290 },
            { x: 540, y: 270 },
            { x: 1000, y: 270 }
        ]
    },
    {
        direction: "N_S",
        coordinates: [
            { x: 520, y: 500 },
            { x: 520, y: 290 },
            { x: 520, y: 0 }
        ]
    },
    {
        direction: "N_L",
        coordinates: [
            { x: 520, y: 500 },
            { x: 520, y: 290 },
            { x: 460, y: 230 },
            { x: 0, y: 230 }
        ]
    },
    {
        direction: "E_R",
        coordinates: [
            { x: 1000, y: 230 },
            { x: 540, y: 230 },
            { x: 520, y: 210 },
            { x: 520, y: 0 }
        ]
    },
    {
        direction: "E_S",
        coordinates: [
            { x: 1000, y: 230 },
            { x: 540, y: 230 },
            { x: 0, y: 230 }
        ]
    },
    {
        direction: "E_L",
        coordinates: [
            { x: 1000, y: 230 },
            { x: 540, y: 230 },
            { x: 480, y: 290 },
            { x: 480, y: 500 }
        ]
    },
    {
        direction: "S_R",
        coordinates: [
            { x: 480, y: 0 },
            { x: 480, y: 210 },
            { x: 460, y: 230 },
            { x: 0, y: 230 }
        ]
    },
    {
        direction: "S_S",
        coordinates: [
            { x: 480, y: 0 },
            { x: 480, y: 210 },
            { x: 480, y: 500 }
        ]
    },
    {
        direction: "S_L",
        coordinates: [
            { x: 480, y: 0 },
            { x: 480, y: 210 },
            { x: 540, y: 270 },
            { x: 1000, y: 270 }
        ]
    },
    {
        direction: "W_R",
        coordinates: [
            { x: 0, y: 270 },
            { x: 460, y: 270 },
            { x: 480, y: 290 },
            { x: 480, y: 500 }
        ]
    },
    {
        direction: "W_S",
        coordinates: [
            { x: 0, y: 270 },
            { x: 460, y: 270 },
            { x: 1000, y: 270 }
        ]
    },
    {
        direction: "W_L",
        coordinates: [
            { x: 0, y: 270 },
            { x: 460, y: 270 },
            { x: 520, y: 210 },
            { x: 520, y: 0 }
        ]
    }
]

const seed_vehicles = [
    {
        type: "Car",
        damage: 90,
        image: "/assets/vehicle_car",
        path: null
    },
    {
        type: "Small Truck",
        damage: 90,
        image: "/assets/vehicle_small_truck",
        path: null
    },
    {
        type: "Large Truck",
        damage: 100,
        image: "/assets/vehicle_large_truck",
        path: null
    },
    {
        type: "Motorcycle",
        damage: 50,
        image: "/assets/vehicle_motorcycle",
        path: null
    },
    {
        type: "Bus",
        damage: 100,
        image: "/assets/vehicle_bus",
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


