import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom'
import App from './App';

// import TrafficControllerProvider from './components/CTC';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    {/* <TrafficControllerProvider> */}
      <App />
    {/* </TrafficControllerProvider> */}
  </Router>
);