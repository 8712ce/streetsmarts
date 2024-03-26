// DEPENDENCIES //
// import { Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
// import axios from "axios";

// PAGES //

// COMPONENTS //
import Header from "./components/Header";
import Footer from "./components/Footer";

import IntersectionLayout from "./components/IntersectionLayout";

// STYLES //
import "./App.css";

function App({ addVehicle }) {
  const [intersection, setIntersection] = useState({ /* Intersection date */ });
  const [vehicles, setVehicles] = useState([]);




  return (
    <div className="App">

      <h1>Street Smarts</h1>
      <h2>4-Way with Stop Signs</h2>
      <button onClick={addVehicle}>Add Vehicle</button>
      <IntersectionLayout intersection={intersection} vehicles={vehicles} addVehicle={addVehicle} />


      {/* <Routes>

        <Route path="/header" element={<Header />} />

        <Route path="/fourWaySignals" element={<FourWaySignals />} />

        <Route path="/footer" element={<Footer />} />

      </Routes> */}

    </div>
  );
}

export default App;
