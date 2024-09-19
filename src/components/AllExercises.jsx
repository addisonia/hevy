import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ExerciseChart from './ExerciseChart';
import { fetchWorkouts } from '../services/api';
import { processExerciseData } from '../utils/dataProcessing';

const AllExercises = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="all-exercises">
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
        <Link to="/" className="btn btn-secondary">← Back</Link>
      </div>
      <h1>All Exercises</h1>
      {workouts.length === 0 ? (
        <p>No workout data available.</p>
      ) : (
        Object.entries(exerciseData).map(([exercise, data]) => (
          <ExerciseChart key={exercise} exercise={exercise} data={data} />
        ))
      )}
    </div>
  );
};

export default AllExercises;