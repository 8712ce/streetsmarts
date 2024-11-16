// DEPENDENCIES //
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// PAGES //
import Login from "./pages/login/login";
import SignUp from "./pages/signUp/signUp";

// COMPONENTS //
import Home from "./components/Home";
import FourWayStopSigns from "./components/FourWayStopSigns";
import FourWayTrafficSignals from "./components/FourWayTrafficSignals";

// STYLES //
import "./App.css";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/four_way_stop_signs" element={<FourWayStopSigns />} />
        <Route path="/four_way_traffic_signals" element={<FourWayTrafficSignals />} />
      </Routes>
  )
}

export default App;
