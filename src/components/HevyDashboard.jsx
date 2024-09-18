import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HevyDashboard = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const apiUrl = 'https://api.hevyapp.com/v1/workouts';
      const apiKey = process.env.REACT_APP_HEVY_API_KEY;
      const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';

      try {
        const response = await fetch(corsProxyUrl + apiUrl, {
          method: 'GET',
          headers: {
            'api-key': apiKey,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch workouts: ${response.status} ${response.statusText}`);
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

  // Process workout data for the chart
  const chartData = workouts.map(workout => ({
    date: new Date(workout.created_at).toLocaleDateString(),
    totalWeight: workout.exercises.reduce((sum, exercise) => 
      sum + exercise.sets.reduce((setSum, set) => setSum + (set.weight * set.reps), 0), 0)
  }));

  return (
    <div className="dashboard">
      <h1>My Hevy Workout Dashboard</h1>
      {workouts.length === 0 ? (
        <p>No workout data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalWeight" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default HevyDashboard;