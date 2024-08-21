// DEPENDENCIES //
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// PAGES //
import Login from "./pages/login/login";
import SignUp from "./pages/signUp/signUp";
import Automobile from "./components/Automobile";
import TrafficControllerProvider, { useTrafficController } from "./components/CTC";
import { getRandomVehicle } from "./utils/api";

// STYLES //
import "./App.css";

const socket = io("http://localhost:8000");

function App() {
  const { registerVehicle, deregisterVehicle } = useTrafficController();
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    console.log('TrafficControllerProvider initialized');
    console.log('useEffect called to initialize event listeners');

    // LISTEN FOR NEW VEHICLE EVENTS //
    socket.on('newVehicle', handleNewVehicle);
    socket.on('updateVehicle', handleUpdateVehicle);
    socket.on('removeVehicle', handleRemoveVehicle);

    return () => {
      console.log('Cleaning up event listeners');
      socket.off('newVehicle', handleNewVehicle);
      socket.off('updateVehicle', handleUpdateVehicle);
      socket.off('removeVehicle', handleRemoveVehicle);
    };
  }, []);



  const handleNewVehicle = (vehicle) => {
    vehicle.currentPosition = vehicle.path && vehicle.path[0] ? vehicle.path[0] : { x: 0, y: 0 }; // ENSURE INITIAL POSITION //
    console.log('New vehicle created:', vehicle);

    // PREVENT DUPLICATES BY CHECKING IF THE VEHICLE ALREADY EXISTS IN STATE //
    setVehicles((prevVehicles) => {
      if (prevVehicles.some(v => v._id === vehicle._id)) {
        console.log(`Duplicate vehicle detected with ID: ${vehicle._id}`);
        return prevVehicles; // DON'T ADD THE DUPLICATE VEHICLE //
      }
      return [...prevVehicles, vehicle];
    });

    // REGISTER THE NEW VEHICLE //
    registerVehicle(vehicle);
  };



  const handleUpdateVehicle = (updatedVehicle) => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) =>
        vehicle._id === updatedVehicle._id ? updatedVehicle : vehicle
      )
    );
  };



  const handleRemoveVehicle = (vehicleId) => {
    deregisterVehicle(vehicleId);
    setVehicles((prevVehicles) => prevVehicles.filter(vehicle => vehicle._id !== vehicleId));
  };



  const setNewAutomobile = async () => {
    try {
      const vehicle = await getRandomVehicle();
      handleNewVehicle(vehicle);
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
          <Automobile key={vehicle._id} vehicle={vehicle} onComplete={removeAutomobile} socket={socket} />
        ))}
      </div>
      <button onClick={setNewAutomobile}>Get Automobile</button>
    </TrafficControllerProvider>
  );
}

export default App;
