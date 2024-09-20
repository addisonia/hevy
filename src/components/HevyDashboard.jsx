import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchWorkouts } from '../services/api';
import { processExerciseData, isBodyweightExercise, isDurationExercise } from '../utils/dataProcessing';
import '../HevyDashboard.css';

const HevyDashboard = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostImprovedExercise, setMostImprovedExercise] = useState(null);
  const [biggestFailExercise, setBiggestFailExercise] = useState(null);

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

  useEffect(() => {
    if (workouts.length > 0) {
      const exerciseData = processExerciseData(workouts);
      const { mostImproved, biggestFail } = findExtremeExercises(exerciseData);
      setMostImprovedExercise(mostImproved);
      setBiggestFailExercise(biggestFail);
    }
  }, [workouts]);

  const findExtremeExercises = (exerciseData) => {
    let maxImprovement = -Infinity;
    let maxDecline = Infinity;
    let mostImproved = null;
    let biggestFail = null;

    Object.entries(exerciseData).forEach(([exercise, data]) => {
      if (data.length >= 6) {
        const firstThree = data.slice(0, 3);
        const lastThree = data.slice(-3);
        const avgFirst = firstThree.reduce((sum, entry) => sum + entry.value, 0) / 3;
        const avgLast = lastThree.reduce((sum, entry) => sum + entry.value, 0) / 3;
        const change = avgLast - avgFirst;
        const percentChange = (change / avgFirst) * 100;

        if (percentChange > maxImprovement) {
          maxImprovement = percentChange;
          mostImproved = { exercise, data, change, percentChange };
        }

        if (percentChange < maxDecline) {
          maxDecline = percentChange;
          biggestFail = { exercise, data, change, percentChange };
        }
      }
    });

    return { mostImproved, biggestFail };
  };

  const getYAxisLabel = (exercise) => {
    if (isBodyweightExercise(exercise)) return 'Reps';
    if (isDurationExercise(exercise)) return 'Time (seconds)';
    return '1RM (lbs)';
  };

  const renderChart = (exerciseData, title, isImprovement) => {
    if (!exerciseData) return null;

    const { exercise, data, change, percentChange } = exerciseData;

    return (
      <div className="chart-container">
        <h2>{title}</h2>
        <h3>{exercise}</h3>
        <p>
          {isImprovement ? 'Improvement' : 'Decline'}: {Math.abs(change).toFixed(2)} {getYAxisLabel(exercise)}
        </p>
        <p>
          {isImprovement ? '+' : '-'}{Math.abs(percentChange).toFixed(2)}%
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              label={{ value: getYAxisLabel(exercise), angle: -90, position: 'insideLeft' }}
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              name={getYAxisLabel(exercise)} 
              stroke="#8884d8" 
              dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8 }}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard">
      <h1>My Hevy Workout Dashboard</h1>
      <div className="button-container">
        <Link to="/all-exercises" className="dashboard-btn dashboard-btn-primary">
          See All Exercises
        </Link>
      </div>
      
      <hr className="section-divider" />
      
      {renderChart(mostImprovedExercise, "Most Improved Exercise", true)}
      
      <hr className="section-divider" />
      
      <div className="spacer"></div>
      
      {renderChart(biggestFailExercise, "Biggest Fail", false)}
      
      <div className="spacer"></div>
    </div>
  );
};

export default HevyDashboard;