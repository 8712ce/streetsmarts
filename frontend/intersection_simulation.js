const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const directions = ['north', 'south', 'east', 'west'];
const vehicles = ['car', 'truck', 'bus', 'motorcycle'];

class Vehicle {
  constructor(type) {
    this.type = type;
  }

  stop() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, Math.floor(Math.random() * 10000) + 1000); // 1-10 seconds
    });
  }
}

class Intersection {
  constructor() {
    this.vehicles = {
      north: [],
      south: [],
      east: [],
      west: []
    };
    this.pedestrianCrossing = false;
  }

  async addVehicle(direction) {
    const type = vehicles[Math.floor(Math.random() * vehicles.length)];
    const vehicle = new Vehicle(type);
    this.vehicles[direction].push(vehicle);
    await vehicle.stop();
    console.log(`${type} heading ${direction} has cleared the intersection.`);
  }

  async pedestrianCross() {
    this.pedestrianCrossing = true;
    console.log('Pedestrian has entered the crosswalk.');
    await this.checkPedestrianSafety();
  }

  async checkPedestrianSafety() {
    for (const direction of directions) {
      for (const vehicle of this.vehicles[direction]) {
        if (this.pedestrianCrossing) {
          console.log(`Pedestrian is struck by ${vehicle.type} from ${direction}`);
          rl.close();
          return;
        }
      }
    }
    console.log('Pedestrian has safely crossed the street.');
    rl.close();
  }

  async startSimulation() {
    console.log('Starting simulation...');
    for (const direction of directions) {
      const numVehicles = Math.floor(Math.random() * 11);
      for (let i = 0; i < numVehicles; i++) {
        await this.addVehicle(direction);
      }
    }

    rl.question('Pedestrian wants to cross. Press any key to allow: ', (answer) => {
      this.pedestrianCross();
    });
  }
}

const intersection = new Intersection();
intersection.startSimulation();
