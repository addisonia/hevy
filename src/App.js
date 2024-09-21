// src/App.js
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import HevyDashboard from './components/HevyDashboard';
import AllExercises from './components/AllExercises';
import CompareExercises from './components/CompareExercises';
import './styles/App.css';
import './styles/CompareExercises.css';
import './styles/ComparisonChart.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HevyDashboard />} />
          <Route path="/all-exercises" element={<AllExercises />} />
          <Route path="/compare-exercises" element={<CompareExercises />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;