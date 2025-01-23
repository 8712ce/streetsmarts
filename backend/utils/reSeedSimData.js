const db = require('../models');
const { seed_paths, seed_vehicles } = require('../models/seed');

const reSeedSimData = async () => {
    try {
        // CLEAR AND RESEED PATHS //
        await db.Path.deleteMany({});
        console.log('Removed all Paths');
        await db.Path.insertMany(seed_paths);
        console.log(`Inserted ${seed_paths.length} paths`);

        // CLEAR AND RESEED VEHICLES //
        await db.Vehicle.deleteMany({});
        console.log('Removed all Vehicles');
        await db.Vehicle.insertMany(seed_vehicles);
        console.log(`Inserted ${seed_vehicles.length} vehicles.`);
    } catch (err) {
        console.error('Error reseeding the database:', err);
    }
};

module.exports = reSeedSimData;