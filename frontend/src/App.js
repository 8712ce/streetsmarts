// DEPENDENCIES //
import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

// PAGES //
import Login from "./pages/login/login";
import SignUp from "./pages/signUp/signUp";

// COMPONENTS //
import Automobile from "./components/Automobile";
import { getRandomVehicle } from "./utils/api";

// STYLES //
import "./App.css";

// INITIALIZE SOCKET.IO CLIENT //
const socket = io("http://localhost:8000");

function App() {
  const [vehicles, setVehicles] = useState([]);



  const handleNewVehicle = useCallback((vehicle) => {
    vehicle.currentPosition = vehicle.path && vehicle.path[0] ? vehicle.path[0] : { x: 0, y: 0 }; // ENSURE INITIAL POSITION //
    console.log('New vehicle created:', vehicle);

    // LOG CURRENT STATE BEFORE UPDATING //
    console.log('Current vehicles state before update:', vehicles);

    // PREVENT DUPLICATES BY CHECKING IF THE VEHICLE ALREADY EXISTS IN STATE //
    setVehicles((prevVehicles) => {
      if (prevVehicles.some(v => v._id === vehicle._id)) {
        console.log(`Duplicate vehicle detected with ID: ${vehicle._id}`);
        return prevVehicles; // DON'T ADD THE DUPLICATE VEHICLE //
      }
      console.log('Adding vehicle to state:', vehicle._id);
      return [...prevVehicles, vehicle];
    });

    // EMIT EVENT TO REGISTER THE NEW VEHICLE IF NEEDED //
    socket.emit('registerVehicle', vehicle);
  }, []);



  const handleUpdateVehicle = useCallback((updatedVehicle) => {
    console.log('Received update for vehicle:', updatedVehicle);
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) =>
        vehicle._id === updatedVehicle._id ? updatedVehicle : vehicle
      )
    );
  }, []);



  const handleRemoveVehicle = useCallback((vehicleId) => {
    console.log('Deregistering vehicle:', vehicleId);
    socket.emit('deregisterVehicle', vehicleId);
    setVehicles((prevVehicles) =>
      prevVehicles.filter((vehicle) => vehicle._id !== vehicleId)
    );
  }, []);



  useEffect(() => {
    console.log('useEffect called to initialize event listeners');
  
    socket.on('newVehicle', handleNewVehicle);
    console.log('Attached newVehicle listener:', handleNewVehicle);
  
    socket.on('updateVehicle', handleUpdateVehicle);
    console.log('Attached updateVehicle listener:', handleUpdateVehicle);
  
    socket.on('removeVehicle', handleRemoveVehicle);
    console.log('Attached removeVehicle listener:', handleRemoveVehicle);

    // Listen for the 'currentVehicles' event
    socket.on('currentVehicles', (vehicles) => {
      console.log('Received current vehicles from server:', vehicles);
      setVehicles(vehicles);
    });
    console.log('Attached currentVehicles listener');
  
    socket.on('reconnect', (attempt) => {
      console.log(`Socket reconnected after ${attempt} attempts`);
    });
  
    // Cleanup function
    return () => {
      console.log('Cleaning up event listeners');
      socket.off('newVehicle', handleNewVehicle);
      socket.off('updateVehicle', handleUpdateVehicle);
      socket.off('removeVehicle', handleRemoveVehicle);
      socket.off('currentVehicles');
      socket.off('reconnect');
    };
  }, [handleNewVehicle, handleUpdateVehicle, handleRemoveVehicle]);  
  


  const setNewAutomobile = async () => {
    try {
      const vehicle = await getRandomVehicle();
      console.log('setNewAutomobile called, passing vehicle to handleNewVehicle...');
    } catch (error) {
      console.error('Error setting new automobile:', error);
    }
  };



  return (
      <div className="container">
        {vehicles.map(vehicle => (
          <Automobile key={vehicle._id} vehicle={vehicle} />
        ))}
        <button onClick={setNewAutomobile}>Get Automobile</button>
      </div>
  );
}

export default App;
