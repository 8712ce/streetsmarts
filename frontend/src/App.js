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

    // CHECK IF USEEFFECT RUNS MORE THAN ONCE //
    let listenerCount = 0;

    // LOG BEFORE REGISTERING THE EVENT LISTENERS //
    console.log('Registering socket listeners...');

    // // Log reconnection events to detect reconnections
    // socket.on('reconnect', (attempt) => {
    //     console.log(`Socket reconnected after ${attempt} attempts`);
    // });

    // LISTEN FOR NEW VEHICLE EVENTS //
    socket.on('newVehicle', (vehicle) => {
        console.log('newVehicle event listener triggered for vehicle ID:', vehicle._id);
        handleNewVehicle(vehicle);
    });

    // LOG AFTER REGISTERING THE NEWVEHICLE LISTENER //
    listenerCount++;
    console.log(`newVehicle listener registered. Current listener count: ${listenerCount}`);
    
    socket.on('updateVehicle', handleUpdateVehicle);
    listenerCount++;
    console.log(`updateVehicle listener registered. Current listener count: ${listenerCount}`);
    
    socket.on('removeVehicle', handleRemoveVehicle);
    listenerCount++;
    console.log(`removeVehicle listener registered. Current listener count: ${listenerCount}`);

    socket.on('reconnect', (attempt) => {
        console.log(`Socket reconnected after ${attempt} attempts`);
    });
    listenerCount++;
    console.log(`reconnect listener registered. Current listener count: ${listenerCount}`);

    // LOG AFTER ALL LISTENERS ARE REGISTERED //
    console.log('All socket listeners registered.');

    return () => {
        console.log('Cleaning up event listeners');

        socket.off('newVehicle', handleNewVehicle);
        socket.off('updateVehicle', handleUpdateVehicle);
        socket.off('removeVehicle', handleRemoveVehicle);
        socket.off('reconnect');

        // RESET LISTENER COUNT //
        listenerCount = 0;
        console.log('Event listeners cleaned up. Current listener count reset.');
      };
  }, []); // Ensure this is empty to prevent multiple registrations




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
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) =>
        vehicle._id === updatedVehicle._id ? updatedVehicle : vehicle
      )
    );
  };



  const handleRemoveVehicle = (vehicleId) => {
    socket.emit('deregisterVehicle', vehicleId); // EMIT EVENT TO DEREGISTER VEHICLE IF NEEDED //
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
    handleRemoveVehicle(vehicleId);
  };



  return (
      <div className="container">
        {vehicles.map(vehicle => (
          <Automobile key={vehicle._id} vehicle={vehicle} onComplete={removeAutomobile} socket={socket} />
        ))}
        <button onClick={setNewAutomobile}>Get Automobile</button>
      </div>
  );
}

export default App;
