// DEPENDENCIES //
import React, { useState, useEffect, useCallback, useRef } from "react";
import io from "socket.io-client";

// PAGES //
import Login from "./pages/login/login";
import SignUp from "./pages/signUp/signUp";

// COMPONENTS //
import Automobile from "./components/Automobile";
import Pedestrian from "./components/Pedestrian";
import { getRandomVehicle, createPedestrian, movePedestrian } from "./utils/api";

// STYLES //
import "./App.css";

// INITIALIZE SOCKET.IO CLIENT //
const socket = io("http://localhost:8000");

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [pedestrian, setPedestrian] = useState(null);



  // USE A REF TO KEEP TRACK OF VEHICLES LENGTH INSIDE THE USEEFFECT //
  const vehiclesLengthRef = useRef(vehicles.length);

  // UPDATE THE REF WEHNEVER VEHICLES CHANGE //
  useEffect(() => {
    vehiclesLengthRef.current = vehicles.length;
  }, [vehicles.length]);



  // VEHICLE HANDLERS //
  const handleNewVehicle = useCallback((vehicle) => {
    console.log('New vehicle created:', vehicle);
  
    setVehicles((prevVehicles) => {
      console.log('Current vehicles state before update:', prevVehicles);
  
      if (prevVehicles.some((v) => v._id === vehicle._id)) {
        console.log(`Duplicate vehicle detected with ID: ${vehicle._id}`);
        return prevVehicles;
      }
      console.log('Adding vehicle to state:', vehicle._id);
      return [...prevVehicles, vehicle];
    });
  }, []);
  


  const handleUpdateVehicle = useCallback((updatedVehicle) => {
    console.log("Received update for vehicle:", updatedVehicle);
    setVehicles((prevVehicles) => {
      const vehicleExists = prevVehicles.some((vehicle) => vehicle._id === updatedVehicle._id);
  
      if (vehicleExists) {
        return prevVehicles.map((vehicle) =>
          vehicle._id === updatedVehicle._id ? updatedVehicle : vehicle
        );
      } else {
        // Vehicle not in state yet; add it
        console.log(`Vehicle ${updatedVehicle._id} not in state; adding it.`);
        return [...prevVehicles, updatedVehicle];
      }
    });
  }, []);
  


  const handleRemoveVehicle = useCallback((vehicleId) => {
    console.log('Removing vehicle from client state:', vehicleId);
    setVehicles((prevVehicles) => prevVehicles.filter((vehicle) => vehicle._id !== vehicleId));
  }, []);




  // PEDESTRIAN HANDLERS //
  const handleNewPedestrian = useCallback((newPedestrian) => {
    console.log('New pedestrian created:', newPedestrian);
    setPedestrian(newPedestrian);
  }, []);

  const handleUpdatePedestrian = useCallback((updatedPedestrian) => {
    console.log('Received update for pedestrian:', updatedPedestrian);
    setPedestrian(updatedPedestrian);
  }, []);

  const handleRemovePedestrian = useCallback((pedestrianId) => {
    console.log('Removing pedestrian from client state:', pedestrianId);
    setPedestrian(null);
  }, []);



  // SOCKET.IO EVENT LISTENERS //
  useEffect(() => {
    console.log('useEffect called to initialize event listeners');
  
    // VEHICLE EVENTS //
    socket.on('newVehicle', handleNewVehicle);
    console.log('Attached newVehicle listener:', handleNewVehicle);
  
    socket.on('updateVehicle', handleUpdateVehicle);
    console.log('Attached updateVehicle listener:', handleUpdateVehicle);
  
    socket.on('removeVehicle', handleRemoveVehicle);
    console.log('Attached removeVehicle listener:', handleRemoveVehicle);

    // PEDESTRIAN EVENTS //
    socket.on('newPedestrian', handleNewPedestrian);
    socket.on('updatePedestrian', handleUpdatePedestrian);
    socket.on('removePedestrian', handleRemovePedestrian);

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

      socket.off('newPedestrian', handleNewPedestrian);
      socket.off('updatePedestrian', handleUpdatePedestrian);
      socket.off('removePedestrian', handleRemovePedestrian);

      socket.off('currentVehicles');
      socket.off('reconnect');
    };
  }, [handleNewVehicle, handleUpdateVehicle, handleRemoveVehicle, handleNewPedestrian, handleUpdatePedestrian, handleRemovePedestrian]);  
  


  // FUNCTION TO CREATE A NEW VEHICLE //
  const setNewAutomobile = async () => {
    try {
      const vehicle = await getRandomVehicle();
      console.log('setNewAutomobile called, passing vehicle to handleNewVehicle...');
    } catch (error) {
      console.error('Error setting new automobile:', error);
    }
  };

  // AUTOMATIC VEHICLE GENERATION WITH MAX_VEHICLES LIMIT //
  useEffect(() => {
    let isMounted = true;
    let timerId;

    const MAX_VEHICLES = 15;

    const generateVehicle = async () => {
      if (!isMounted) return;

      if (vehiclesLengthRef.current < MAX_VEHICLES) {
        await setNewAutomobile();
      } else {
        console.log('Maximum number of vehicles reached.');
      }

      // GENERATE A RANDOM DELAY BETWEEN 1 AND 10 SECONDS //
      const delay = Math.random() * (8000 - 1000) + 1000;

      timerId = setTimeout(generateVehicle, delay);
    };

    // START THE VEHICLE GENERATION LOOP //
    generateVehicle();

    // CLEANUP FUNCTION TO STOP VEHICLE GENERATION WHEN COMPONENT UNMOUNTS //
    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, []); // EMPTY DEPENDENCY ARRAY ENSURES THIS RUNS ONCE ON MOUNT //



  // FUNCTION TO CREATE A NEW PEDESTRIAN //
  const createNewPedestrian = async () => {
    try {
      const pedestrianData = {
        name: 'Player1', //CUSTOMIZE AS NEEDED//
        image: 'assets/pedestrian_kid.png',
      };
      const response = await createPedestrian(pedestrianData);
      console.log('Created new pedestrian:', response);
    } catch (error) {
      console.error('Error creating new pedestrian:', error);
    }
  };

  // FUNCTION TO MOVE PEDESTRIAN //
  const movePedestrianHandler = async (direction) => {
    try {
      if (!pedestrian || !pedestrian._id) {
        console.log('No pedestrian to move.');
        return;
      }
      await movePedestrian(pedestrian._id, direction);
    } catch (error) {
      console.log(`Error moving pedestrian ${direction}:`, error);
    }
  };



  // VIEWPORT SECTION //
  const viewportRef = useRef(null);

  useEffect(() => {
    // Center the viewport on load
    const viewport = viewportRef.current;
    if (viewport) {
      const middlePosition = 1000; // Scroll to 1000px to show the middle third
      viewport.scrollLeft = middlePosition;
    }
  }, []);

  const scrollToPosition = (position) => {
    const viewport = viewportRef.current;
    if (viewport) {
      let targetScrollLeft = 0;

      if (position === 'left') {
        targetScrollLeft = 0;
      } else if (position === 'center') {
        targetScrollLeft = 1000; // Middle third
      } else if (position === 'right') {
        targetScrollLeft = 2000; // Rightmost third
      }

      viewport.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
      });
    }
  };



  return (
    <div className="outer-container">
      <div className="viewport" ref={viewportRef}>
        <div className="container">
          <img
            src={`${process.env.PUBLIC_URL}/assets/bg_4way_signs.jpg`}
            alt="Intersection"
            className="background-image"
          />
          {vehicles.map(vehicle => (
            <Automobile key={vehicle._id} vehicle={vehicle} />
          ))}
          {pedestrian && <Pedestrian pedestrian={pedestrian} />}
        </div>
      </div>

      <div className="button-container">
        <button onClick={() => scrollToPosition('left')}>Look Left</button>
        <button onClick={() => scrollToPosition('center')}>Center View</button>
        <button onClick={() => scrollToPosition('right')}>Look Right</button>
      </div>
    </div>
  );
}

export default App;
