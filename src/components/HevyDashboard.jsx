import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HevyDashboard = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExercises, setShowExercises] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/workouts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        setWorkouts(data.workouts || []);
        setLoading(false);
      } catch (error) {
        console.error('Error details:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const processExerciseData = () => {
    const exerciseData = {};

    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (!exerciseData[exercise.title]) {
          exerciseData[exercise.title] = [];
        }
        
        const totalWeight = exercise.sets.reduce((sum, set) => {
          const weight = parseFloat(set.weight_kg) || 0;
          const reps = parseInt(set.reps) || 0;
          return sum + (weight * reps);
        }, 0);

        exerciseData[exercise.title].push({
          date: new Date(workout.created_at).toLocaleDateString(),
          totalWeight: totalWeight || 0  // Ensure we always have a number
        });
      });
    });

    return exerciseData;
  };

  const exerciseData = processExerciseData();

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
            <div key={exercise}>
              <h2>{exercise}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="totalWeight" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))
        )
      )}
    </div>
  );
};

export default HevyDashboard;