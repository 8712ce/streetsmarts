const db = require('./')

const seed_vehicles = [
    {
        type: "Car",
        topSpeed: 10,
        damage: 90,
        image: "Coming Soon"
    },
    {
        type: "Small Truck",
        topSpeed: 10,
        damage: 90,
        image: "Coming Soon"
    },
    {
        type: "Large Truck",
        topSpeed: 10,
        damage: 100,
        image: "Coming Soon"
    },
    {
        type: "Motorcycle",
        topSpeed: 10,
        damage: 50,
        image: "Coming Soon"
    },
    {
        type: "Bus",
        topSpeed: 10,
        damage: 100,
        image: "Coming Soon"
    },
]

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