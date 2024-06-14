// DEPENDENCIES //
import React, { useState, useEffect, useRef } from "react";

// PAGES //
import Login from "./pages/login/login";
import SignUp from "./pages/signUp/signUp";
// COMPONENTS //
// import StudentForm from "./components/StudentForm";
// import TestPath from "./components/TestPath";
// import MovingSquare from './components/TannerMovingSquare'
import Automobile from "./components/Automobile";


// import TrafficControllerProvider, { useTrafficController } from "./components/CTC";
import TrafficControllerProvider, { useTrafficController } from "./components/CTC";
import { getRandomVehicle } from "./utils/api";

// STYLES //
import "./App.css";


function App() {

//   const [isLoggedIn, setIsLoggedIn] = useState(true)
//   const [userId, setUserId] = useState()

const { registerVehicle } = useTrafficController(); // Destructure registerVehicle from context //
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    console.log('TrafficControllerProvider initialized');
  }, []);

  const setNewAutomobile = async () => {
      try {
          const vehicle = await getRandomVehicle();
          vehicle.position = vehicle.path && vehicle.path[0] ? vehicle.path[0] : { x: 0, y: 0 }; // Ensure initial position
          console.log('New vehicle created:', vehicle);

          setVehicles((prevVehicles) => {
            console.log('Previous Vehicles state:', prevVehicles);
            const updatedVehicles = [...prevVehicles, vehicle];
            console.log('Updated vehicles state:', updatedVehicles);
            return updatedVehicles;
          });

          // CALL registerVehicle TO REGISTER THE NEW VEHICLE //
          registerVehicle(vehicle);
      } catch (error) {
          console.error('Error setting new automobile:', error);
      }
  };

  const removeAutomobile = (vehicleId) => {
      setVehicles((prevVehicles) => {
        const updatedVehicles = prevVehicles.filter(vehicle => vehicle._id !== vehicleId);
        console.log('Vehicles state after removal:', updatedVehicles);
        return updatedVehicles;
      });
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
