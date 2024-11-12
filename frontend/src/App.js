// DEPENDENCIES //
import React from "react";

// PAGES //
import Login from "./pages/login/login";
import SignUp from "./pages/signUp/signUp";

// COMPONENTS //
import FourWayStopSigns from "./components/FourWayStopSigns";

// STYLES //
import "./App.css";

// INITIALIZE SOCKET.IO CLIENT //


function App() {
  return <FourWayStopSigns />
}

export default App;
