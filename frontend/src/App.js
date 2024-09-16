// DEPENDENCIES //
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// PAGES //
import Login from "./pages/login/login";
import SignUp from "./pages/signUp/signUp";
import Automobile from "./components/Automobile";
import { getRandomVehicle } from "./utils/api";

// STYLES //
import "./App.css";

// INITIALIZE SOCKET.IO CLIENT //
const socket = io("http://localhost:8000");

function App() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    console.log('useEffect called to initialize event listeners');

    // Clean up any existing listeners before adding new ones
    socket.off('newVehicle').on('newVehicle', (vehicle) => {
        console.log('newVehicle event listener triggered for vehicle ID:', vehicle._id);
        handleNewVehicle(vehicle);
    });

    socket.off('updateVehicle').on('updateVehicle', handleUpdateVehicle);
    socket.off('removeVehicle').on('removeVehicle', handleRemoveVehicle);
    socket.off('reconnect').on('reconnect', (attempt) => {
        console.log(`Socket reconnected after ${attempt} attempts`);
    });

    // Cleanup function to remove listeners when the component is unmounted or updated
    return () => {
        console.log('Cleaning up event listeners');
        socket.off('newVehicle');
        socket.off('updateVehicle');
        socket.off('removeVehicle');
        socket.off('reconnect');
    };
  }, []); // Empty dependency array to ensure useEffect runs only once on mount





  const handleNewVehicle = (vehicle) => {
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
  };



  const handleUpdateVehicle = (updatedVehicle) => {
    console.log('Received update for vehicle:', updatedVehicle); // LOG INCOMING VEHICLE UPDATE //
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) =>
        vehicle._id === updatedVehicle._id ? updatedVehicle : vehicle
      )
    );
  };



  const handleRemoveVehicle = (vehicleId) => {
    console.log('Deregistering vehicle:', vehicleId);
    socket.emit('deregisterVehicle', vehicleId); // EMIT EVENT TO DEREGISTER VEHICLE IF NEEDED //
    setVehicles((prevVehicles) => {
      console.log('Filtering vehicles:', prevVehicles); // LOG VEHICLES BEFORE FILTERING //
      return prevVehicles.filter(vehicle => vehicle._id !== vehicleId);
    });
  };



  const setNewAutomobile = async () => {
    try {
      const vehicle = await getRandomVehicle();
      console.log('setNewAutomobile called, passing vehicle to handleNewVehicle...');
      // handleNewVehicle(vehicle);
    } catch (error) {
      console.error('Error setting new automobile:', error);
    }
  };



  return (
      <div className="container">
        {vehicles.map(vehicle => (
          <Automobile key={vehicle._id} vehicle={vehicle} onComplete={handleRemoveVehicle} socket={socket} />
        ))}
        <button onClick={setNewAutomobile}>Get Automobile</button>
      </div>
  );
}

export default App;
