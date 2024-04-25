// DEPENDENCIES //
// import { Routes, Route } from "react-router-dom";
import React, { useState } from "react";
// import axios from "axios";

// PAGES //

// COMPONENTS //
// import Header from "./components/Header";
// import Footer from "./components/Footer";

import IntersectionLayout from "./components/IntersectionLayout";
import TwoWayStop from "./components/TwoWayStop";

// STYLES //
import "./App.css";
import TestPath from "./components/TestPath";


function App() {
  const [intersection, setIntersection] = useState({ /* Intersection date */ });
  const [vehicles, setVehicles] = useState([]);




  return (
    <div className="App">

      <h1>Street Smarts</h1>
      <h2>2-Way with Crosswalk</h2>
      <TestPath />
      <IntersectionLayout intersection={intersection} vehicles={vehicles} />
      {/* <TwoWayStop /> */}


      {/* <Routes>

        <Route path="/header" element={<Header />} />

        <Route path="/fourWaySignals" element={<FourWaySignals />} />

        <Route path="/footer" element={<Footer />} />

      </Routes> */}

    </div>
  );
}

export default App;
