// DEPENDENCIES //
import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";

// PAGES //
import Login from "./pages/login/login";
import SignUp from "./pages/signUp/signUp";
import SignIn from "./components/SignIn";

// COMPONENTS //
// import Home from "./components/Home";
import SelectionMenu from "./components/SelectionMenu";
import FourWayStopSigns from "./components/FourWayStopSigns";
import FourWayTrafficSignals from "./components/FourWayTrafficSignals";
import DifficultyMenu from "./components/DifficultyMenu";
import SimulationContainer from "./components/SimulationContainer";

// STYLES //
import "./App.css";

function App() {
  return (
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<SignIn />} />
        <Route path="/menu" element={<SelectionMenu />} />
        <Route path="/four_way_stop_signs" element={<FourWayStopSigns />} />
        <Route path="/four_way_traffic_signals" element={<FourWayTrafficSignals />} />
      </Routes>

      // <Routes>
      //   <Route path="/" element={<DifficultyMenu />} />
      //   <Route path="/simulation" element={<SimulationContainer />} />
      // </Routes>
  );
}

export default App;
