// DEPENDENCIES //
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";

// PAGES //

// COMPONENTS //
import Header from "./components/Header";
import Footer from "./components/Footer";

// STYLES //
import "./App.css";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  console.log(isLoggedIn)
  return (
    <div className="App">
      <Routes>

        <Route path="/header" element={<Header />} />

        <Route path="/fourWaySignals" element={<FourWaySignals />} />

        <Route path="/footer" element={<Footer />} />

      </Routes>
      


      </Router>
    </div>
  );
}

export default App;
