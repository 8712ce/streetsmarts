import {useState} from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Login from './pages/logIn';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  console.log(isLoggedIn)
  return (
    <div className="App">
      <Router>
        <Routes>

         <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
        </Routes>
  



      </Router>
    </div>
  );
}

export default App;
