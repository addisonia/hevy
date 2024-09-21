// ComparisonChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { isBodyweightExercise, isDurationExercise } from '../utils/dataProcessing';

const ComparisonChart = ({ exercise, myData, chaitanyaData }) => {
  const getYAxisLabel = () => {
    if (isBodyweightExercise(exercise)) return 'Reps';
    if (isDurationExercise(exercise)) return 'Time (seconds)';
    return '1RM (lbs)';
  };

  const combinedData = myData.map(entry => ({
    date: entry.date,
    myValue: entry.value,
    chaitanyaValue: chaitanyaData.find(d => d.date === entry.date)?.value
  })).concat(
    chaitanyaData.filter(entry => !myData.find(d => d.date === entry.date))
      .map(entry => ({
        date: entry.date,
        chaitanyaValue: entry.value
      }))
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <h2>{exercise}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="myValue" 
            name="Addison" 
            stroke="#8884d8" 
            dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 8 }}
            connectNulls={true}
          />
          <Line 
            type="monotone" 
            dataKey="chaitanyaValue" 
            name="Chaitanya" 
            stroke="#82ca9d" 
            dot={{ stroke: '#82ca9d', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 8 }}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;