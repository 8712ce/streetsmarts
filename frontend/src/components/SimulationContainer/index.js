import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from "axios";
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

// INITIALIZE SOCKET.IO CLIENT //
import socket from '../../utils/socket';

// COMPONENTS //
import Automobile from '../Automobile';
import Pedestrian from '../Pedestrian';
import TrafficLight from '../TrafficLight';
import GameOverModal from '../GameOverModal';
import CrossedStreetModal from '../CrossedStreetModal';
import BeginnerGuide from '../BeginnerGuide';
import IntermediateGuide from '../IntermediateGuide';
import Controls from '../Controls';
import { getRandomVehicle, createPedestrian } from '../../utils/api';
import EyeContact from '../EyeContact/eyeContact';

import './simulationContainer.css';

function SimulationContainer({ backgroundImage, simulationType, difficulty = 'expert', adventureLabel, children }) {

  const navigate = useNavigate();
  
  const studentId = localStorage.getItem('studentId') || null;
  const teacherId = localStorage.getItem('teacherId') || null;

  const token = localStorage.getItem('token') || '';

  // ATTACH AUTHORIZATION HEADER FOR ALL STUDENT-BASED REQUESTS //
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const [vehicles, setVehicles] = useState([]);
  const [pedestrian, setPedestrian] = useState(null);
  const [isGameOverModalVisible, setIsGameOverModalVisible] = useState(false);
  const [vehicleTypeThatHit, setVehicleTypeThatHit] = useState('');
  const [playerPedestrianId, setPlayerPedestrianId] = useState(null);
  const [isCrossedStreetModalVisible, setIsCrossedStreetModalVisible] = useState(false);

  const [studentTotalScore, setStudentTotalScore] = useState(0);
  const [teacherTotalScore, setTeacherTotalScore] = useState(0);

  const [studentDestinationScore, setStudentDestinationScore] = useState(0);
  const [teacherDestinationScore, setTeacherDestinationScore] = useState(0);


  const [studentName, setStudentName] = useState('');
  const [teacherName, setTeacherName] = useState('');

  const [error, setError] = useState('');
  const [eyeContactVehicle, setEyeContactVehicle] = useState(null);

  // BEGINNER GUIDE STATES //
  const [tutorialStep, setTutorialStep] = useState(1);

  // INTERMEDIATE GUIDE STATES //
  const [showStreetCornerReminder, setShowStreetCornerReminder] = useState(false);
  const [showCenterLineReminder, setShowCenterLineReminder] = useState(false);

  const clearIntermediateReminders = () => {
    setShowStreetCornerReminder(false);
    setShowCenterLineReminder(false);
  }

  // IF DIFFICULTY IS 'BEGINNER', DEFINE DISABLING LOGIC, ELSE KEEP THEM ENABLED //
  let disableForward = false;
  let disableBackward = false;
  let disableLookLeft = false;
  let disableLookRight = false;
  let disableLookCenter = false;

  if (difficulty === 'beginner') {
    disableForward = !(tutorialStep === 1 || tutorialStep === 5 || tutorialStep === 7);
    disableBackward = !(tutorialStep === 1 || tutorialStep === 5 || tutorialStep === 7);
    disableLookLeft = !(tutorialStep === 2 || tutorialStep === 6);
    disableLookRight = !(tutorialStep === 3 || tutorialStep === 6);
    disableLookCenter = !(tutorialStep === 4);
  }


  const [searchParams] = useSearchParams();
  // const difficulty = searchParams.get('difficulty') || 'expert';

  const label = adventureLabel

  let threshold;
  if (label === 'Bank') {
    threshold = 125;
  } else if (label === 'School') {
    threshold = 250;
  }



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

    if (!updatedVehicle.image) {
      console.warn(`Vehicle ${updatedVehicle._id} is missing an image!`);
    }

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
    // CHECK IF THE PEDESETRIAN BELONGS TO THE CURRENT SIMULATION //
    if (newPedestrian.simulationType === simulationType) {
      setPedestrian(newPedestrian);
      // setPedestrianName(newPedestrian.name);
      setPlayerPedestrianId(newPedestrian._id);
      console.log('Set playerPedestrianId:', newPedestrian._id);
    }
    // setPedestrian(newPedestrian);
  }, [simulationType]);

  const handleUpdatePedestrian = useCallback((updatedPedestrian) => {
    console.log('Received update for pedestrian:', updatedPedestrian);
    if (updatedPedestrian.simulationType === simulationType) {
      setPedestrian(updatedPedestrian);
      console.log('Pedestrian state updated:', updatedPedestrian);
    }
  }, [simulationType]);


  const handleRemovePedestrian = useCallback((pedestrianId) => {
    console.log('Removing pedestrian from client state:', pedestrianId);

    if (playerPedestrianId === pedestrianId) {
      setPedestrian(null);
      // DO NOT SET PLAYERPEDESTRIANID TO NULL HERE //
      console.log('Players pedestrian state set to null in handleRemovePedestrian.');
    } else {
      console.log(`Non-player pedestrian ${pedestrianId} removed.`);
    }
  }, [playerPedestrianId]);



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

    socket.on('streetCornerReached', ({ pedestrianId, pedestrianName }) => {
      console.log(`Received streetCornerReached event for pedestrianId: ${pedestrianId}.`);

      // CHECK IF THIS IS THE PLAYER'S PEDESTRIAN //
      if (playerPedestrianId === pedestrianId) {
        console.log('Your pedestrian reached the street corner.');
        if (difficulty === 'beginner' && tutorialStep <= 2) {
          setTutorialStep(2);
        }
        else if (difficulty === 'intermediate') {
          setShowStreetCornerReminder(true);
          console.log('Intermediate bubble triggered for streetCorner.')
        }
      }
    });



    socket.on('centerLineReached', ({ pedestrianId, pedestrianName }) => {
      console.log(`Received centerLineReached event for pedestrianID: ${pedestrianId}`);

      // CHECK IF THIS IS THE PLAYER'S PEDESTRIAN //
      if (playerPedestrianId === pedestrianId) {
        console.log('Your pedestrian reached the middle of the street.');
        if (difficulty === 'beginner' && tutorialStep <= 6) {
          setTutorialStep(6);
        }
        else if (difficulty === 'intermediate') {
          console.log('Intermediate bubble triggered for centerLine.')
          setShowCenterLineReminder(true);
        }
      }
    });



    // PEDESTRIAN SUCCESSFULLY CROSSED STREET //
    socket.on('crossedStreet', ({ pedestrianId, pedestrianName }) => {
      console.log(`Received crossedStreet event for pedestrianId: ${pedestrianId}`);

      // CHECK IF THIS IS THE PLAYER'S PEDESTRIAN //
      if (playerPedestrianId === pedestrianId) {
        console.log('Your pedestrian successfully crossed the street.');
        // setPedestrianName(pedestrianName);
        setIsCrossedStreetModalVisible(true);
      }
    });



    // PEDESTRIAN KILLED EVENT //
    socket.on('pedestrianKilled', ({ pedestrianId, vehicleType }) => {
      console.log(`Received pedestrianKilled event for pedestrianId: ${pedestrianId}`);
      console.log('Current playerPedestrianId:', playerPedestrianId);
      console.log('Received vehicleType:', vehicleType);
    
      if (playerPedestrianId === pedestrianId) {
        console.log('Your pedestrian was killed.');
        setIsGameOverModalVisible(true);
        console.log('setIsGameOverModalVisible(true) called.');
        setVehicleTypeThatHit(vehicleType);
        setPedestrian(null);
        setPlayerPedestrianId(null); // Set to null after handling
      } else {
        console.log(`Pedestrian ${pedestrianId} was killed, but it is not your pedestrian.`);
      }
    });
    


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

      socket.off('streetCornerReached');

      socket.off('centerLineReached');

      socket.off('crossedStreet');

      socket.off('pedestrianKilled');

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
    // pedestrian,
    simulationType,
    playerPedestrianId
  ]);



  useEffect(() => {
    if (!studentId && !teacherId) {
        console.warn('No student or teacher ID found. Skipping student score fetch.');
        return;
    }

    async function fetchScore() {
      // FETCH STUDENT SCORE IF A STUDENT ID EXISTS //
      if (studentId) {
        try {
            // FETCH THE STUDENT'S TOTAL SCORE //
            const studentRes = await axios.get(`http://localhost:8000/students/${studentId}`, config);
            const studentDoc = studentRes.data;

            // UPDATE THE STATE WITH TEH STUDENT'S TOTAL SCORE //
            setStudentTotalScore(studentDoc.score);
            setStudentDestinationScore(studentDoc.destinationScore);
            setStudentName(studentDoc.screenName);
            console.log('Fetched student score:', studentDoc.score);
        } catch (err) {
            console.error('Error fetching student score:', err);
            setError('Could not load student score.  Please try again.');
        }
      }

      // FETCH TEACHER SCORE IF A TEACHER ID EXISTS //
      if (teacherId) {
        try {
          const teacherRes = await axios.get(`http://localhost:8000/teachers/${teacherId}`, config);
          const teacherDoc = teacherRes.data;
          setTeacherTotalScore(teacherDoc.score);
          setTeacherDestinationScore(teacherDoc.destinationScore);
          setTeacherName(teacherDoc.screenName);
          console.log('Fetched teacher score:', teacherDoc.score);
        } catch (err) {
          console.error('Error fetching teacher score:', err);
          setError('Could not load teacher score.  Please try again.');
        }
      }
    }

    fetchScore();
  }, [studentId, teacherId, config]);
  


  const handlePlayAgain = () => {
    setIsGameOverModalVisible(false);
    setVehicleTypeThatHit('');

    setStudentName('');
    setTeacherName('');
    // OPTIONALLY RESET THE GAME OR REDIRECT //
    createNewPedestrian();
  };



  const handleContinueAdventure = () => {
    // setIsCrossedStreetModalVisible(false);
    const sims = ['stopSign', 'trafficSignal'];
    const r = Math.floor(Math.random() * sims.length);
    const nextSim = sims[r];

    if (nextSim === 'stopSign') {
      navigate('/four_way_stop_signs', {
        state: { difficulty }
      });
    } else {
      navigate('/four_way_traffic_signals', {
        state: { difficulty }
      });
    }
  };



  const handleExit = () => {
    navigate('/');
  };



  // FUNCTION TO CREATE A NEW VEHICLE //
  const setNewAutomobile = async () => {
    try {
      const vehicle = await getRandomVehicle(simulationType);
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

      // GENERATE A RANDOM DELAY BETWEEN 1 AND 8 SECONDS //
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
        simulationType: simulationType,
        // student: studentId || null
      };

      if (studentId) {
        pedestrianData.student = studentId;
      } else if (teacherId) {
        pedestrianData.teacher = teacherId;
      }

      const response = await createPedestrian(pedestrianData);
      console.log('Created new pedestrian:', response);
    } catch (error) {
      console.error('Error creating new pedestrian:', error);
    }
  };



  // PLACE PEDESTRIAN IN SIMULATION AT PAGE LOAD //
  useEffect(() => {
    createNewPedestrian();
  }, [simulationType]);



  // FUNCTION TO MOVE PEDESTRIAN //
  const movePedestrianHandler = (direction) => {
    console.log(`Emitting 'movePedestrian' with direction: ${direction}`);
    if (!pedestrian || !pedestrian._id) {
      console.log('No pedestrian to move.');
      return;
    }
    socket.emit('movePedestrian', {
      pedestrianId: pedestrian._id,
      direction,
      simulationType,
    });
  };



  // WRAPPER FUNCTION FOR MOVING PEDESTRIAN FORWARD //
  const handleMoveForward = () => {
    movePedestrianHandler('forward');
    if (difficulty === 'beginner') {
      if (tutorialStep === 1) { setTutorialStep(2); }
      // else if (tutorialStep === 5) { setTutorialStep(6); }
    }
    // if (tutorialStep === 1) {
    //   setTutorialStep(2);
    // }
    else if (difficulty === 'intermediate') {
      clearIntermediateReminders();
    }
  };

  // WRAPPER FUNCTION FOR MOVING PEDESTRIAN BACKWARD //
  const handleMoveBackward = () => {
    movePedestrianHandler('backward');
    clearIntermediateReminders();
  };




  // // HANDLER TO TRIGGER THE EYE CONTACT POPUP WHEN AN AUTOMOBILE IS CLICKED //
  // const handleAutomobileClick = (vehicle) => {
  //   setEyeContactVehicle(null);
  //   // USE A SMALL TIMEOUT TO ENSURE THE STATE CHANGE IS PROCESSSED //
  //   setTimeout(() => {
  //     setEyeContactVehicle(vehicle);
  //   }, 0);
  // };

  // // HANDLER TO CLEAR THE POPUP (CALLED BY EYECONTACT AFTER ITS TIMEOUT/ANIMATION) //
  // const handleCloseEyeContact = () => {
  //   setEyeContactVehicle(null);
  // };



  const leaveTimeoutRef = useRef(null);
  
  // WHEN THE MOUSE ENTERS AN AUTOMOBILE, SET TEH HOVERED VEHICLE //
  const handleAutomobileHover = (vehicle) => {
    setEyeContactVehicle(vehicle);
  };

  // WHEN THE MOUSE LEAVES, CLEAR THE HOVERED VEHICLE //
  const handleCloseEyeContact = () => {
    setEyeContactVehicle(null);
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



  // ADD TO SCORE BY LOOKING LEFT AND/OR RIGHT //
  const handleLook = (direction) => {
    if (!pedestrian || ! pedestrian._id) {
      console.log('No pedestrian available to increase score.');
      return;
    }

    scrollToPosition(direction);

    socket.emit('increaseScore', {
      pedestrianId: pedestrian._id,
      // ONLY INCLUDE STUDENT ID IF LOGGED IN AS A STUDENT //
      studentId: studentId || null,
      teacherId: teacherId || null,
      simulationType,
      increment: 25,
      
    });

    if (difficulty === 'beginner') {
      if (direction === 'left') {
        if (tutorialStep === 2) setTutorialStep(3);
        else if (tutorialStep === 6); // PROBABLY SETTUTORIALSTEP(X) //
      } else if (direction === 'right') {
        if (tutorialStep === 3) setTutorialStep(4);
        else if (tutorialStep === 6) setTutorialStep(7);
      } else if (direction === 'center') {
        if (tutorialStep === 4) setTutorialStep(5);
      }
    }
    
    else if (difficulty === 'intermediate') {
      clearIntermediateReminders();
    }
  };



  let guideToRender = null;
  if (difficulty === 'beginner') {
    guideToRender = <BeginnerGuide tutorialStep={tutorialStep} />;
  } else if (difficulty === 'intermediate') {
    guideToRender = <IntermediateGuide
      showStreetCornerReminder={showStreetCornerReminder}
      showCenterLineReminder={showCenterLineReminder}
      />;
  }



  useEffect(() => {
    // NOTIFY SERVER WHEN THE USER LEAVES A SIMULATION //
    const handleBeforeUnload = () => {
      console.log('Emitting leaveSimulation event for cleanup');
      socket.emit('leaveSimulation', simulationType);
    };

    // LISTEN FOR THE BEFOREUNLOAD EVENT //
    window.addEventListener('beforeunload', handleBeforeUnload);

    // CLEANUP ON COMPONENT UNMOUNT OR SIMULATIONTYPE CHANGE //
    return () => {
      console.log('Cleaning up simulation event listeners');
      handleBeforeUnload();
      // socket.emit('leavingSimulation', simulationType);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [simulationType]);



  if (error) {
    return <div>{error}</div>;
  }



  return (
    <div className="outer-container">
      {/* SCORE DISPLAY */}
      {pedestrian && (
        <div className="score-display">
          Score: {pedestrian.score}
        </div>
      )}

      <div className="viewport" ref={viewportRef}>
        <div className="container">
          <img
            src={`${process.env.PUBLIC_URL}/assets/${backgroundImage}`}
            alt="Simulation Background"
            className="background-image"
          />
          {vehicles.map(vehicle => (
            <Automobile
              key={vehicle._id}
              vehicle={vehicle}
              onMouseEnter={handleAutomobileHover}
              onMouseLeave={handleCloseEyeContact}
            />
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

      {guideToRender}

      <div style={{ padding: 20 }}>

        <Controls
          onMoveForward={handleMoveForward}
          onMoveBackward={handleMoveBackward}

          onLookLeft={() => handleLook('left')}
          onLookCenter={() => handleLook('center')}
          onLookRight={() => handleLook('right')}

          disableForward={disableForward}
          disableBackward={disableBackward}
          disableLookLeft={disableLookLeft}
          disableLookRight={disableLookRight}
          disableLookCenter={disableLookCenter}
        />

      </div>

      {/* GAME OVER MODAL */}
      <GameOverModal
        visible={isGameOverModalVisible}

        studentName={studentName}
        teacherName={teacherName}

        vehicleType={vehicleTypeThatHit}
        onPlayAgain={handlePlayAgain}
      />

      {/* CROSSED STREET MODAL */}
      <CrossedStreetModal
        visible={isCrossedStreetModalVisible}

        studentName={studentName}
        teacherName={teacherName}

        studentTotalScore={studentTotalScore}
        teacherTotalScore={teacherTotalScore}

        studentDestinationScore={studentDestinationScore}
        teacherDestinationScore={teacherDestinationScore}

        threshold={threshold}
        onContinueAdventure={handleContinueAdventure}
        onExit={handleExit}
      />

      {eyeContactVehicle && (
        <EyeContact vehicle={eyeContactVehicle} />
      )}

    </div>
  );

}

export default SimulationContainer;