import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExerciseChart = ({ exercise, data }) => (
  <div>
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
);

export default ExerciseChart;