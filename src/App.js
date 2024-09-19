import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import HevyDashboard from './components/HevyDashboard';
import AllExercises from './components/AllExercises';
import './App.css';  // Make sure this line is present

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HevyDashboard />} />
          <Route path="/all-exercises" element={<AllExercises />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;