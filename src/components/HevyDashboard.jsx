import React, { useState, useEffect } from 'react';
import ExerciseChart from './ExerciseChart';
import { fetchWorkouts } from '../services/api';
import { processExerciseData } from '../utils/dataProcessing';

const HevyDashboard = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExercises, setShowExercises] = useState(false);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const allWorkouts = await fetchWorkouts();
        setWorkouts(allWorkouts);
        setLoading(false);
      } catch (error) {
        console.error('Error details:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const exerciseData = processExerciseData(workouts);

  return (
    <div className="dashboard">
      <h1>My Hevy Workout Dashboard</h1>
      <button onClick={() => setShowExercises(!showExercises)}>
        {showExercises ? 'Hide Exercises' : 'Show Exercises'}
      </button>
      {workouts.length === 0 ? (
        <p>No workout data available.</p>
      ) : (
        showExercises && (
          Object.entries(exerciseData).map(([exercise, data]) => (
            <ExerciseChart key={exercise} exercise={exercise} data={data} />
          ))
        )
      )}
    </div>
  );
};

export default HevyDashboard;