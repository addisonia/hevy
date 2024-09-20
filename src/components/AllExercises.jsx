import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ExerciseChart from './ExerciseChart';
import FilterButton from './FilterButton';
import { fetchWorkouts } from '../services/api';
import { processExerciseData, adjustTimelineData, isBodyweightExercise, isDurationExercise } from '../utils/dataProcessing';

const defaultFilters = {
  'weight & reps': true,
  'bodyweight': true,
  'duration': true,
  '<= 5 entries': true,
  'old exercises': true,
};

const AllExercises = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTimelineAdjusted, setIsTimelineAdjusted] = useState(() => {
    const saved = localStorage.getItem('isTimelineAdjusted');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem('filters');
    return saved !== null ? JSON.parse(saved) : defaultFilters;
  });

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
    localStorage.setItem('isTimelineAdjusted', JSON.stringify(isTimelineAdjusted));
  }, [isTimelineAdjusted]);

  useEffect(() => {
    localStorage.setItem('filters', JSON.stringify(filters));
  }, [filters]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const exerciseData = processExerciseData(workouts);
  const adjustedData = isTimelineAdjusted ? adjustTimelineData(exerciseData) : exerciseData;

  const filterExercises = (exercise, data) => {
    if (!filters['weight & reps'] && !isBodyweightExercise(exercise) && !isDurationExercise(exercise)) return false;
    if (!filters['bodyweight'] && isBodyweightExercise(exercise)) return false;
    if (!filters['duration'] && isDurationExercise(exercise)) return false;
    
    if (!filters['<= 5 entries'] && data.length <= 5) return false;
    
    if (!filters['old exercises']) {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const mostRecentDate = new Date(data[data.length - 1].date);
      if (mostRecentDate < threeMonthsAgo) return false;
    }
    
    return true;
  };

  const toggleTimeline = () => {
    setIsTimelineAdjusted(prev => !prev);
  };

  return (
    <div className="all-exercises">
      <div className="top-buttons">
        <Link to="/" className="btn btn-secondary back-button">← Back</Link>
        <FilterButton filters={filters} onChange={setFilters} />
      </div>
      <h1>All Exercises</h1>
      <button onClick={toggleTimeline} className="btn btn-primary mb-4">
        {isTimelineAdjusted ? "Revert Timeline Back" : "Adjust Timeline"}
      </button>
      {Object.entries(adjustedData).length === 0 ? (
        <p>No workout data available.</p>
      ) : (
        Object.entries(adjustedData)
          .filter(([exercise, data]) => filterExercises(exercise, data))
          .map(([exercise, data]) => (
            <ExerciseChart 
              key={exercise} 
              exercise={exercise} 
              data={data} 
              isTimelineAdjusted={isTimelineAdjusted}
            />
          ))
      )}
    </div>
  );
};

export default AllExercises;