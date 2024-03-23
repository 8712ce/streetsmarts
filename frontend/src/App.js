// DEPENDENCIES //
// import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
// import axios from "axios";

// PAGES //

// COMPONENTS //
import Header from "./components/Header";
import Footer from "./components/Footer";
// import FourWaySignals from "./components/FourWaySignals";
import StopSigns from "./components/FourWayStopSign";
import FourWayStopSign from "./components/FourWayStopSign";
import OneWayStopSigns from "./components/OneWayStopSigns";

// STYLES //
import "./App.css";

function App() {
  return (
    <div className="App">

      <h1>Street Smarts</h1>
      <h2>4-Way with Traffic Lights</h2>
      {/* <FourWaySignals intersectionType="trafficLights" /> */}

      <h2>4-Way with Stop Signs</h2>
      {/* <StopSigns intersectionType="stopSigns" /> */}


      {/* <Routes>

        <Route path="/header" element={<Header />} />

        <Route path="/fourWaySignals" element={<FourWaySignals />} />

        <Route path="/footer" element={<Footer />} />

      </Routes> */}

      {/* <FourWayStopSign /> */}

      <OneWayStopSigns />
      


    </div>
  );
}

export default App;
