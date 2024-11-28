import React, { useState, useEffect, useCallback, useRef } from 'react';

// INITIALIZE SOCKET.IO CLIENT //
import socket from '../../utils/socket';

// COMPONENTS //
import Automobile from '../Automobile';
import Pedestrian from '../Pedestrian';
import TrafficLight from '../TrafficLight';
import { getRandomVehicle, createPedestrian, movePedestrian } from '../../utils/api';

import './simulationContainer.css';

function SimulationContainer({ backgroundImage, simulationType, children }) {
  const [vehicles, setVehicles] = useState([]);
  const [pedestrian, setPedestrian] = useState(null);

  // TRAFFIC SIGNAL STATES //
  const [trafficSignalStates, setTrafficSignalStates] = useState({
    northbound: 'red',
    eastbound: 'red',
    southbound: 'red',
    westbound: 'red'
  });

  // USE A REF TO KEEP TRACK OF VEHICLES LENGTH INSIDE THE USEEFFECT //
  const vehiclesLengthRef = useRef(vehicles.length);

  // UPDATE THE REF WEHNEVER VEHICLES CHANGE //
  useEffect(() => {
    vehiclesLengthRef.current = vehicles.length;
  }, [vehicles.length]);



  // NOTIFY SERVER WHICH SIMULATION THE CLIENT HAS JOINED //
  useEffect(() => {
    socket.emit('joinSimulation', simulationType);
    console.log(`Emitted 'joinSimulation' with simulationType: ${simulationType}`);

    // CLEANUP ON UNMOUNT //
    return () => {
      // OPTIONALLY NOTIFY THE SERVER THAT THE CLIENT HAS LEFT //
      console.log(`Component unmounted or simulationType changed from ${simulationType}`);
      // Example: socket.emit('leaveSimulation', simulationType);
    };
  }, [simulationType]);



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
    console.log('Received update for vehicle:', updatedVehicle);
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



  // TRAFFIC SIGNAL HANDLER //
  const handleTrafficSignalUpdate = useCallback((updatedStates) => {
    console.log('Received traffic signal update:', updatedStates);
    setTrafficSignalStates(updatedStates);
  }, []);



  // SOCKET.IO EVENT LISTENERS //
  useEffect(() => {
    console.log('useEffect called to initialize event listeners');

    // CAPTURE THE CURRENT SIMULATION TYPE //
    const currentSimulationType = simulationType;
  
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




    // TRAFFIC SIGNAL EVENTS //
    if (currentSimulationType === 'trafficSignal') {
      socket.on('trafficSignalUpdate', handleTrafficSignalUpdate);
      console.log('Attached trafficSignalUpdate listener:', handleTrafficSignalUpdate);
    }


  
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

      if (currentSimulationType === 'trafficSignal') {
        socket.off('trafficSignalUpdate', handleTrafficSignalUpdate);
      }

      socket.off('reconnect');
    };
  }, [
    handleNewVehicle,
    handleUpdateVehicle,
    handleRemoveVehicle,
    handleNewPedestrian,
    handleUpdatePedestrian,
    handleRemovePedestrian,
    handleTrafficSignalUpdate,
    simulationType
  ]);  
  


  // FUNCTION TO CREATE A NEW VEHICLE //
  const setNewAutomobile = async () => {
    try {
      const vehicle = await getRandomVehicle(simulationType);
      console.log('setNewAutomobile called, passing vehicle to handleNewVehicle...');
    } catch (error) {
      console.error('Error setting new automobile:', error);
    }
  };
  // const setNewAutomobile = async () => {
  //   try {
  //     const vehicle = await getRandomVehicle();
  //     console.log('setNewAutomobile called, passing vehicle to handleNewVehicle...');
  //   } catch (error) {
  //     console.error('Error setting new automobile:', error);
  //   }
  // };

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
  }, [simulationType]); // RE-RUN WHEN SIMULATION TYPE CHANGES //



  // FUNCTION TO CREATE A NEW PEDESTRIAN //
  const createNewPedestrian = async () => {
    try {
      const pedestrianData = {
        name: 'Player1', //CUSTOMIZE AS NEEDED//
        image: 'assets/pedestrian_kid.png',
        simulationType: simulationType
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
      await movePedestrian(pedestrian._id, direction, simulationType);
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
      const containerWidth = viewport.scrollWidth;
      const viewportWidth = viewport.clientWidth;
      const middlePosition = (containerWidth - viewportWidth) / 2;
      viewport.scrollLeft = middlePosition;
    }
  }, []);

  const scrollToPosition = (position) => {
    const viewport = viewportRef.current;
    if (viewport) {
      const containerWidth = viewport.scrollWidth;
      const viewportWidth = viewport.clientWidth;
      let targetScrollLeft = 0;

      if (position === 'left') {
        targetScrollLeft = 0;
      } else if (position === 'center') {
        targetScrollLeft = (containerWidth - viewportWidth) / 2;
      } else if (position === 'right') {
        targetScrollLeft = containerWidth - viewportWidth;
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
            src={`${process.env.PUBLIC_URL}/assets/${backgroundImage}`}
            alt="Simulation Background"
            className="background-image"
          />
          {vehicles.map(vehicle => (
            <Automobile key={vehicle._id} vehicle={vehicle} />
          ))}
          {pedestrian && <Pedestrian pedestrian={pedestrian} />}

          {/* RENDER TRAFFIC LIGHTS IF SIMULATION TYPE IS 'TRAFFICSIGNAL' */}
          {simulationType === 'trafficSignal' && (
            <>
              <TrafficLight position="north" state={trafficSignalStates.northbound} />
              <TrafficLight position="east" state={trafficSignalStates.eastbound} />
              <TrafficLight position="south" state={trafficSignalStates.southbound} />
              <TrafficLight position="west" state={trafficSignalStates.westbound} />
            </>
          )}
          
          {children}
        </div>
      </div>

      <div className="button-container">
        <button onClick={() => scrollToPosition('left')}>Look Left</button>
        <button onClick={() => scrollToPosition('center')}>Center View</button>
        <button onClick={() => scrollToPosition('right')}>Look Right</button>

        <button onClick={() => movePedestrianHandler('forward')}>Move Forward</button>
        <button onClick={() => movePedestrianHandler('backward')}>Move Backward</button>
      </div>
    </div>
  );

}

export default SimulationContainer;