import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExerciseChart = ({ exercise, data, isTimelineAdjusted }) => {
  const isBodyweightExercise = (exercise) => {
    const bodyweightExercises = [
      'Pull Up', 'Dip', 'Push Up', 'Sit Up', 'Chin Up',
      'Leg Raise', 'Pull-up', 'Muscle Up', 'Pullup',
      'Front Lever Raise', 'Lying Leg Raise', 'Crunch'
    ];
    return bodyweightExercises.some(bwExercise => 
      exercise.toLowerCase().includes(bwExercise.toLowerCase()) && 
      !exercise.toLowerCase().includes('weighted') &&
      !exercise.toLowerCase().includes('machine')
    );
  };

  const isDurationExercise = (exercise) => {
    const durationExercises = [
      'Plank', 'Hold', 'Hang', 'Horse Squat', 'Front Lever Hold', 'Air Bike'
    ];
    return durationExercises.some(durExercise => 
      exercise.toLowerCase().includes(durExercise.toLowerCase())
    );
  };

  const getYAxisLabel = () => {
    if (isBodyweightExercise(exercise)) return 'Reps';
    if (isDurationExercise(exercise)) return 'Time (seconds)';
    return '1RM (lbs)';
  };

  const formatTooltipValue = (value) => {
    if (isDurationExercise(exercise)) {
      const minutes = Math.floor(value / 60);
      const seconds = value % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return value;
  };

  const xAxisProps = isTimelineAdjusted
    ? {
        dataKey: "date",
        type: "number",
        domain: ['dataMin', 'dataMax'],
        tickFormatter: (unixTime) => new Date(unixTime).toLocaleDateString(),
      }
    : {
        dataKey: "date",
        type: "category",
      };

  return (
    <div>
      <h2>{exercise}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis {...xAxisProps} />
          <YAxis 
            label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <Tooltip 
            labelFormatter={(value) => isTimelineAdjusted ? new Date(value).toLocaleDateString() : value}
            formatter={(value) => formatTooltipValue(value)}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            name={getYAxisLabel()} 
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

export default ExerciseChart;