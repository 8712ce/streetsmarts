// DEPENDENCIES //
// import { Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
// import axios from "axios";

// PAGES //

// COMPONENTS //
import Header from "./components/Header";
import Footer from "./components/Footer";

import OneWayStopSigns from "./components/OneWayStopSigns";

// STYLES //
import "./App.css";

function App() {
  const [intersection, setIntersection] = useState({ /* Intersection date */ });
  const [vehicles, setVehicles] = useState([]);

  // FUNCTION TO GENERATE A RANDOM VEHICLE //
  const generateRandomVehicle = () => {
    const types = ["car", "small truck", "motorcycle", "big truck", "bus"];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const directions = ["north", "south", "east", "west"];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];

    return {
      type: randomType,
      position: { x: Math.random() * 500, y: Math.random() * 300 }, // RANDOM POSITION WITHIN INTERSECTION // WE DONT WANT THIS, WE WANT FIXED POSITIONS DEPENDING ON THE TYPE OF INTERSECTION //
      direction: randomDirection
    };
  }

  // Event handler for adding vehicles. //
  const addVehicle = () => {
    const newVehicle = generateRandomVehicle();
    setVehicles([...vehicles, newVehicle]);
  }

  // Event handler for removing vehicles. //
  const removeVehicle = (index) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles.splice(index, 1);
    setVehicles(updatedVehicles);
  }



  return (
    <div className="App">

      <h1>Street Smarts</h1>
      <h2>4-Way with Stop Signs</h2>
      <button onClick={addVehicle}>Add Vehicle</button>
      <OneWayStopSigns intersection={intersection} vehicles={vehicles}/>


      {/* <Routes>

        <Route path="/header" element={<Header />} />

        <Route path="/fourWaySignals" element={<FourWaySignals />} />

        <Route path="/footer" element={<Footer />} />

      </Routes> */}

    </div>
  );
}

export default App;
