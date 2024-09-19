import React from 'react';
import { Link } from 'react-router-dom';

const HevyDashboard = () => {
  return (
    <div className="dashboard">
      <h1>My Hevy Workout Dashboard</h1>
      <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Link to="/all-exercises" className="btn btn-primary">
          See All Exercises
        </Link>
      </div>
    </div>
  );
};

export default HevyDashboard;