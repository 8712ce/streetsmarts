// DEPENDENCIES //

import { Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import React from "react";

// PAGES //
import Login from "./pages/login/login";
import SignUp from "./pages/signUp/signUp";
// COMPONENTS //

import Header from "./components/Header";
import Footer from "./components/Footer";
// import FourWaySignals from "./components/FourWaySignals";
import StopSigns from "./components/FourWayStopSign";
import StudentForm from "./components/StudentForm";

// STYLES //
import "./App.css";
import TestPath from "./components/TestPath";


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [userId, setUserId] = useState() 

  console.log(userId)
  return (
    <div className="App">

      <h1>Street Smarts</h1>

      
      {/* <FourWaySignals intersectionType="trafficLights" /> */}

      
      <StopSigns intersectionType="stopSigns" />

      <Routes>
        
        <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} setUserId={setUserId}/>} />
        <Route path='/signup' element={<SignUp setIsLoggedIn={setIsLoggedIn}/>} />
        {/* <Route path="/header" element={<Header />} />

        <Route path="/fourWaySignals" element={<FourWaySignals />} />

        <Route path="/footer" element={<Footer />} /> */}

        <Routes />

    </div>
  );
}

export default App;
