// DEPENDENCIES //
import React, { useState } from "react";

// PAGES //

// COMPONENTS //

import IntersectionLayout from "./components/IntersectionLayout";


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




    </div>
  );
}

export default App;
