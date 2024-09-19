import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HevyDashboard from './components/HevyDashboard';
import AllExercises from './components/AllExercises';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HevyDashboard />} />
          <Route path="/all-exercises" element={<AllExercises />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;