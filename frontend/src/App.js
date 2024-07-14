// DEPENDENCIES //
import React, { useState, useEffect } from "react";

// PAGES //
import Login from "./pages/login/login";
import SignUp from "./pages/signUp/signUp";
import Automobile from "./components/Automobile";
import TrafficControllerProvider, { useTrafficController } from "./components/CTC";
import { getRandomVehicle } from "./utils/api";

// STYLES //
import "./App.css";

function App() {
  const { registerVehicle, deregisterVehicle, occupiedCoordinates } = useTrafficController();
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    console.log('TrafficControllerProvider initialized');
  }, []);

  const setNewAutomobile = async () => {
    try {
      const vehicle = await getRandomVehicle();
      vehicle.position = vehicle.path && vehicle.path[0] ? vehicle.path[0] : { x: 0, y: 0 }; // Ensure initial position
      console.log('New vehicle created:', vehicle);

      // Register the new vehicle
      registerVehicle(vehicle);
      
      // Update local state for rendering purposes
      setVehicles((prevVehicles) => [...prevVehicles, vehicle]);
    } catch (error) {
      console.error('Error setting new automobile:', error);
    }
  };

  const removeAutomobile = (vehicleId) => {
    deregisterVehicle(vehicleId);
    setVehicles((prevVehicles) => prevVehicles.filter(vehicle => vehicle._id !== vehicleId));
  };

  return (
    <TrafficControllerProvider>
      <div className="container">
        {vehicles.map(vehicle => (
          <Automobile key={vehicle._id} vehicle={vehicle} onComplete={removeAutomobile} />
        ))}
      </div>
      <button onClick={setNewAutomobile}>Get Automobile</button>
    </TrafficControllerProvider>
  );
}

export default App;
