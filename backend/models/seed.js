const db = require('./')

const seed_paths = [
    {
        direction: "N_R",
        coordinates: [
            { x: 38, y: 100 },
            { x: 39.4, y: 89.5 },
            { x: 41, y: 77.5 }, // STOP SIGN //

            { x: 41.7, y: 71.8 }, // INTERSECTION //
            { x: 43.9, y: 67.8 }, // INTERSECTION //
            { x: 46.4, y: 67.2 }, // INTERSECTION //

            { x: 50, y: 67.2 },
            { x: 64, y: 64 },
            { x: 82.3, y: 57.3 },
            { x: 102, y: 44.8 }
        ]
    },
    {
        direction: "N_S",
        coordinates: [
            { x: 38, y: 100 },
            { x: 39.4, y: 89.5 },
            { x: 41, y: 77.5 }, // STOP SIGN //

            { x: 41.7, y: 71.8 }, // INTERSECTION //
            { x: 42.8, y: 63.4 }, // INTERSECTION //
            { x: 43.7, y: 55.9 }, // INTERSECTION //

            { x: 44.1, y: 52.9 },
            { x: 44.6, y: 49.2 },
            { x: 45.4, y: 41.5 }
        ]
    },
    {
        direction: "N_L",
        coordinates: [
            { x: 38, y: 100 },
            { x: 39.4, y: 89.5 },
            { x: 41, y: 77.5 }, // STOP SIGN //

            { x: 41.7, y: 71.8 }, // INTERSECTION //
            { x: 42.8, y: 63.4 }, // INTERSECTION //
            { x: 39.4, y: 59.2 }, // INTERSECTION //
            { x: 31.5, y: 58.6 }, // INTERSECTION //

            { x: 24.9, y: 57.4 },
            { x: 18.3, y: 55.2 },
            { x: 7.3, y: 51.1 },
            { x: 0.2, y: 44.7 }
        ]
    },
    {
        direction: "E_R",
        coordinates: [
            { x: 0.1, y: 51.6 },
            { x: 5.7, y: 59.2 },
            { x: 16.8, y: 63.9 },
            { x: 27.3, y: 66.7 }, // STOP SIGN //

            { x: 29.4, y: 66.9 }, // INTERSECTION //
            { x: 31.4, y: 68.4 }, // INTERSECTION //
            { x: 32.6, y: 72.6 }, // INTERSECTION //

            { x: 31.3, y: 77.8 },
            { x: 29.4, y: 86.7 },
            { x: 26.6, y: 100 }
        ]
    },
    {
        direction: "E_S",
        coordinates: [
            { x: 0.1, y: 51.6 },
            { x: 5.7, y: 59.2 },
            { x: 16.8, y: 63.9 },
            { x: 27.3, y: 66.7 }, // STOP SIGN //

            { x: 29.4, y: 66.9 }, // INTERSECTION //
            { x: 38.1, y: 67.6 }, // INTERSECTION //
            { x: 46.4, y: 67.2 }, // INTERSECTION //

            { x: 50, y: 67.2 },
            { x: 64, y: 64 },
            { x: 82.3, y: 57.3 },
            { x: 102, y: 44.8 }
        ]
    },
    {
        direction: "E_L",
        coordinates: [
            { x: 0.1, y: 51.6 },
            { x: 5.7, y: 59.2 },
            { x: 16.8, y: 63.9 },
            { x: 27.3, y: 66.7 }, // STOP SIGN //

            { x: 29.4, y: 66.9 }, // INTERSECTION //
            { x: 38.1, y: 67.6 }, // INTERSECTION //
            { x: 42.8, y: 63.4 }, // INTERSECTION //
            { x: 43.7, y: 55.9 }, // INTERSECTION //

            { x: 44.1, y: 52.9 },
            { x: 44.6, y: 49.2 },
            { x: 45.4, y: 41.5 }
        ]
    },
    {
        direction: "S_R",
        coordinates: [
            { x: 38.7, y: 44.2 },
            { x: 37.6, y: 49 },
            { x: 36.6, y: 53.5 }, // STOP SIGN //

            { x: 35.9, y: 57 }, // INTERSECTION //
            { x: 33.8, y: 58.8 }, // INTERSECTION //
            { x: 31.5, y: 58.6 }, // INTERSECTION //

            { x: 24.9, y: 57.4 },
            { x: 18.3, y: 55.2 },
            { x: 7.3, y: 51.1 },
            { x: 0.2, y: 44.7 }
        ]
    },
    {
        direction: "S_S",
        coordinates: [
            { x: 38.7, y: 44.2 },
            { x: 37.6, y: 49 },
            { x: 36.6, y: 53.5 }, // STOP SIGN //

            { x: 35.9, y: 57 }, // INTERSECTION //
            { x: 34.5, y: 63.4 }, // INTERSECTION //
            { x: 32.6, y: 72.6 }, // INTERSECTION //

            { x: 31.3, y: 77.8 },
            { x: 29.4, y: 86.7 },
            { x: 26.6, y: 100 }
        ]
    },
    {
        direction: "S_L",
        coordinates: [
            { x: 38.7, y: 44.2 },
            { x: 37.6, y: 49 },
            { x: 36.6, y: 53.5 }, // STOP SIGN //

            { x: 35.9, y: 57 }, // INTERSECTION //
            { x: 34.5, y: 63.4 }, // INTERSECTION //
            { x: 38.1, y: 67.6 }, // INTERSECTION //
            { x: 46.4, y: 67.2 }, // INTERSECTION //

            { x: 50, y: 67.2 },
            { x: 64, y: 64 },
            { x: 82.3, y: 57.3 },
            { x: 102, y: 44.8 }
        ]
    },
    {
        direction: "W_R",
        coordinates: [
            { x: 98.1, y: 44.5 },
            { x: 81.3, y: 52.3 },
            { x: 63.6, y: 57.3 },
            { x: 50.1, y: 59.2 },
            { x: 48.3, y: 59.5 }, // STOP SIGN //

            { x: 46.9, y: 60.1 }, // INTERSECTION //
            { x: 44.8, y: 58.8 }, // INTERSECTION //
            { x: 43.7, y: 55.9 }, // INTERSECTION //

            { x: 44.1, y: 52.9 },
            { x: 44.6, y: 49.2 },
            { x: 45.4, y: 41.5 }
        ]
    },
    {
        direction: "W_S",
        coordinates: [
            { x: 98.1, y: 44.5 },
            { x: 81.3, y: 52.3 },
            { x: 63.6, y: 57.3 },
            { x: 50.1, y: 59.2 },
            { x: 48.3, y: 59.5 }, // STOP SIGN //

            { x: 46.9, y: 60.1 }, // INTERSECTION //
            { x: 39.4, y: 59.2 }, // INTERSECTION //
            { x: 31.5, y: 58.6 }, // INTERSECTION //

            { x: 24.9, y: 57.4 },
            { x: 18.3, y: 55.2 },
            { x: 7.3, y: 51.1 },
            { x: 0.2, y: 44.7 }
        ]
    },
    {
        direction: "W_L",
        coordinates: [
            { x: 98.1, y: 44.5 },
            { x: 81.3, y: 52.3 },
            { x: 63.6, y: 57.3 },
            { x: 50.1, y: 59.2 },
            { x: 48.3, y: 59.5 }, // STOP SIGN //

            { x: 46.9, y: 60.1 }, // INTERSECTION //
            { x: 39.4, y: 59.2 }, // INTERSECTION //
            { x: 34.5, y: 63.4 }, // INTERSECTION //
            { x: 32.6, y: 72.6 }, // INTERSECTION //

            { x: 31.3, y: 77.8 },
            { x: 29.4, y: 86.7 },
            { x: 26.6, y: 100 }
        ]
    },
]

const seed_vehicles = [
    {
        type: "Car",
        damage: 90,
        image: "/assets/vehicle_car.png",
        path: null,
        currentPosition: { x: 0, y: 0 },
        speed: null,          // Optional field; set to null or omit if not used
        isMoving: false,
        isSeed: true,
        currentIndex: 0,
        isWaiting: false,
        waitUntil: null,
        simulationType: null
    },
    {
        type: "Small Truck",
        damage: 90,
        image: "/assets/vehicle_small_truck.png",
        path: null,
        currentPosition: { x: 0, y: 0 },
        speed: null,
        isMoving: false,
        isSeed: true,
        currentIndex: 0,
        isWaiting: false,
        waitUntil: null,
        simulationType: null
    },
    {
        type: "Large Truck",
        damage: 100,
        image: "/assets/vehicle_large_truck.png",
        path: null,
        currentPosition: { x: 0, y: 0 },
        speed: null,
        isMoving: false,
        isSeed: true,
        currentIndex: 0,
        isWaiting: false,
        waitUntil: null,
        simulationType: null
    },
    {
        type: "Motorcycle",
        damage: 50,
        image: "/assets/vehicle_motorcycle.png",
        path: null,
        currentPosition: { x: 0, y: 0 },
        speed: null,
        isMoving: false,
        isSeed: true,
        currentIndex: 0,
        isWaiting: false,
        waitUntil: null,
        simulationType: null
    },
    {
        type: "Bus",
        damage: 100,
        image: "/assets/vehicle_bus.png",
        path: null,
        currentPosition: { x: 0, y: 0 },
        speed: null,
        isMoving: false,
        isSeed: true,
        currentIndex: 0,
        isWaiting: false,
        waitUntil: null,
        simulationType: null
    }
];

module.exports = { seed_paths, seed_vehicles };



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