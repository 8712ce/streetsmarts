const db = require('./')

const seed_paths = [
    {
        direction: "N_R",
        coordinates: [
            { x: 625, y: 1000 },
            { x: 625, y: 875 },
            { x: 625, y: 750 },

            { x: 657, y: 719 },
            { x: 688, y: 688 },
            { x: 719, y: 657 },

            { x: 750, y: 625 },
            { x: 875, y: 625 },
            { x: 1000, y: 625 }
        ]
    },
    {
        direction: "N_S",
        coordinates: [
            { x: 625, y: 1000 },
            { x: 625, y: 875 },
            { x: 625, y: 750 },

            { x: 625, y: 625 },
            { x: 625, y: 500 },
            { x: 625, y: 375 },

            { x: 625, y: 250 },
            { x: 625, y: 125 },
            { x: 625, y: 0 }
        ]
    },
    {
        direction: "N_L",
        coordinates: [
            { x: 625, y: 1000 },
            { x: 625, y: 875 },
            { x: 625, y: 750 },

            { x: 625, y: 625 },
            { x: 625, y: 500 },
            { x: 500, y: 375 },

            { x: 250, y: 375 },
            { x: 125, y: 375 },
            { x: 0, y: 375 }
        ]
    },
    {
        direction: "E_R",
        coordinates: [
            { x: 0, y: 625 },
            { x: 125, y: 625 },
            { x: 250, y: 625 },

            { x: 282, y: 657 },
            { x: 313, y: 688 },
            { x: 344, y: 719 },

            { x: 375, y: 750 },
            { x: 375, y: 875 },
            { x: 375, y: 1000 }
        ]
    },
    {
        direction: "E_S",
        coordinates: [
            { x: 0, y: 625 },
            { x: 125, y: 625 },
            { x: 250, y: 625 },

            { x: 375, y: 625 },
            { x: 500, y: 625 },
            { x: 625, y: 625 },

            { x: 750, y: 625 },
            { x: 875, y: 625 },
            { x: 1000, y: 625 }
        ]
    },
    {
        direction: "E_L",
        coordinates: [
            { x: 0, y: 625 },
            { x: 125, y: 625 },
            { x: 250, y: 625 },

            { x: 375, y: 625 },
            { x: 500, y: 625 },
            { x: 625, y: 500 },

            { x: 625, y: 250 },
            { x: 625, y: 125 },
            { x: 625, y: 0 }
        ]
    },
    {
        direction: "S_R",
        coordinates: [
            { x: 375, y: 0 },
            { x: 375, y: 125 },
            { x: 375, y: 250 },

            { x: 344, y: 282 },
            { x: 313, y: 313 },
            { x: 282, y: 344 },

            { x: 250, y: 375 },
            { x: 125, y: 375 },
            { x: 0, y: 375 }
        ]
    },
    {
        direction: "S_S",
        coordinates: [
            { x: 375, y: 0 },
            { x: 375, y: 125 },
            { x: 375, y: 250 },

            { x: 375, y: 375 },
            { x: 375, y: 500 },
            { x: 375, y: 625 },

            { x: 375, y: 750 },
            { x: 375, y: 875 },
            { x: 375, y: 1000 }
        ]
    },
    {
        direction: "S_L",
        coordinates: [
            { x: 375, y: 0 },
            { x: 375, y: 125 },
            { x: 375, y: 250 },

            { x: 375, y: 375 },
            { x: 375, y: 500 },
            { x: 500, y: 625 },

            { x: 750, y: 625 },
            { x: 875, y: 625 },
            { x: 1000, y: 625 }
        ]
    },
    {
        direction: "W_R",
        coordinates: [
            { x: 1000, y: 375 },
            { x: 875, y: 375 },
            { x: 750, y: 375 },

            { x: 719, y: 344 },
            { x: 688, y: 313 },
            { x: 657, y: 282 },

            { x: 625, y: 250 },
            { x: 625, y: 125 },
            { x: 625, y: 0 }
        ]
    },
    {
        direction: "W_S",
        coordinates: [
            { x: 1000, y: 375 },
            { x: 875, y: 375 },
            { x: 750, y: 375 },

            { x: 625, y: 375 },
            { x: 500, y: 375 },
            { x: 375, y: 375 },

            { x: 250, y: 375 },
            { x: 125, y: 375 },
            { x: 0, y: 375 }
        ]
    },
    {
        direction: "W_L",
        coordinates: [
            { x: 1000, y: 375 },
            { x: 875, y: 375 },
            { x: 750, y: 375 },

            { x: 625, y: 375 },
            { x: 500, y: 375 },
            { x: 375, y: 500 },

            { x: 375, y: 750 },
            { x: 375, y: 875 },
            { x: 375, y: 1000 }
        ]
    },
]

const seed_vehicles = [
    {
        type: "Car",
        damage: 90,
        image: "/assets/vehicle_car.png",
        path: null,
        isSeed: true
    },
    {
        type: "Small Truck",
        damage: 90,
        image: "/assets/vehicle_small_truck.png",
        path: null,
        isSeed: true
    },
    {
        type: "Large Truck",
        damage: 100,
        image: "/assets/vehicle_large_truck.png",
        path: null,
        isSeed: true
    },
    {
        type: "Motorcycle",
        damage: 50,
        image: "/assets/vehicle_motorcycle.png",
        path: null,
        isSeed: true
    },
    {
        type: "Bus",
        damage: 100,
        image: "/assets/vehicle_bus.png",
        path: null,
        isSeed: true
    }
];







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
