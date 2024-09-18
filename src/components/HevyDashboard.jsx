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
        let allWorkouts = [];
        let page = 1;
        let hasMoreData = true;

        while (hasMoreData) {
          // Call your new Cloudflare Worker
          const response = await fetch(`https://hevy-proxy.ajatkin.workers.dev/workouts?page=${page}&pageSize=10`);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          allWorkouts = [...allWorkouts, ...(data.workouts || [])];
          
          if (data.workouts.length < 10) {
            hasMoreData = false;
          } else {
            page++;
          }
        }

        console.log('Fetched data:', allWorkouts);
        setWorkouts(allWorkouts);
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

  const kgToLbs = (kg) => kg * 2.20462;

  const calculate1RM = (weight, reps) => {
    return weight * (1 + reps / 30);
  };

  const processExerciseData = () => {
    const exerciseData = {};

    workouts.forEach(workout => {
      const workoutDate = new Date(workout.created_at).toLocaleDateString();
      
      workout.exercises.forEach(exercise => {
        if (!exerciseData[exercise.title]) {
          exerciseData[exercise.title] = [];
        }
        
        const max1RM = exercise.sets.reduce((max, set) => {
          const weight = kgToLbs(parseFloat(set.weight_kg) || 0);
          const reps = parseInt(set.reps) || 0;
          const oneRM = calculate1RM(weight, reps);
          return oneRM > max ? oneRM : max;
        }, 0);

        exerciseData[exercise.title].push({
          date: workoutDate,
          oneRM: Math.round(max1RM)  // Round to nearest pound
        });
      });
    });

    // Sort data points by date for each exercise
    Object.keys(exerciseData).forEach(exercise => {
      exerciseData[exercise].sort((a, b) => new Date(a.date) - new Date(b.date));
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
                  <XAxis 
                    dataKey="date" 
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
                  />
                  <YAxis 
                    label={{ value: '1RM (lbs)', angle: -90, position: 'insideLeft' }}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="oneRM" name="1RM" stroke="#8884d8" />
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