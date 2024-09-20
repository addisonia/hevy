import React from 'react';
import { Link } from 'react-router-dom';
import '../HevyDashboard.css'; // Import the new CSS file

const HevyDashboard = () => {
  return (
    <div className="dashboard">
      <h1>My Hevy Workout Dashboard</h1>
      <div className="button-container">
        <Link to="/all-exercises" className="dashboard-btn dashboard-btn-primary">
          See All Exercises
        </Link>
      </div>
      {/* Add more dashboard content here */}
    </div>
  );
};

export default HevyDashboard;