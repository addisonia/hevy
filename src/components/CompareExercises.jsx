// src/components/CompareExercises.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchWorkouts } from '../services/api';
import { processExerciseData } from '../utils/dataProcessing';
import ComparisonChart from './ComparisonChart';

const CompareExercises = () => {
  const [myWorkouts, setMyWorkouts] = useState([]);
  const [chaitanyaWorkouts, setChaitanyaWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const myData = await fetchWorkouts();
        const chaitanyaData = await fetchWorkouts('/friend-endpoint');
        setMyWorkouts(myData);
        setChaitanyaWorkouts(chaitanyaData);
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

  const myExerciseData = processExerciseData(myWorkouts);
  const chaitanyaExerciseData = processExerciseData(chaitanyaWorkouts);

  const commonExercises = Object.keys(myExerciseData).filter(exercise => 
    chaitanyaExerciseData[exercise] && 
    myExerciseData[exercise].length >= 6 && 
    chaitanyaExerciseData[exercise].length >= 6
  );

  return (
    <div className="compare-exercises">
      <div className="top-buttons">
        <Link to="/" className="btn btn-secondary back-button">← Back</Link>
      </div>
      <h1 className="page-title">Compare Exercises with Chaitanya</h1>
      <div className="charts-container">
        {commonExercises.map(exercise => (
          <ComparisonChart
            key={exercise}
            exercise={exercise}
            myData={myExerciseData[exercise]}
            chaitanyaData={chaitanyaExerciseData[exercise]}
          />
        ))}
      </div>
    </div>
  );
};

export default CompareExercises;