// DEPENDENCIES //
import React from "react";
import { Routes, Route } from "react-router-dom";

// COMPONENTS //
import Navigation from "./components/Navigation";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboarad from "./components/StudentDashboard";
import MyStudents from "./components/MyStudents";
import SelectionMenu from "./components/SelectionMenu";
import FourWayStopSigns from "./components/FourWayStopSigns";
import FourWayTrafficSignals from "./components/FourWayTrafficSignals";

// STYLES //
import "./App.css";


function App() {
  return (
    <>
      <Navigation />
      
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/teacherDashboard" element={<TeacherDashboard />} />
        <Route path="/studentDashboard" element={<StudentDashboarad />} />
        <Route path="/teacher/students" element={<MyStudents />} />
        <Route path="/menu" element={<SelectionMenu />} />
        <Route path="/four_way_stop_signs" element={<FourWayStopSigns />} />
        <Route path="/four_way_traffic_signals" element={<FourWayTrafficSignals />} />
      </Routes>
    </>
      
  );
}

export default App;
