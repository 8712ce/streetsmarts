// DEPENDENCIES //
import { useState, useEffect, useRef } from "react";
import React from "react";

// PAGES //
import Login from "./pages/login/login";
import SignUp from "./pages/signUp/signUp";
// COMPONENTS //

import Header from "./components/Header";
import Footer from "./components/Footer";
import StudentForm from "./components/StudentForm";

// STYLES //
import "./App.css";
import TestPath from "./components/TestPath";
import MovingSquare from './components/TannerMovingSquare'

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [userId, setUserId] = useState() 

  return (
    <div className="App">

      <h1>Street Smarts</h1>

      
      {/* <FourWaySignals intersectionType="trafficLights" /> */}

      <MovingSquare />
      <TestPath />

  

    </div>
  );
}

export default App;
