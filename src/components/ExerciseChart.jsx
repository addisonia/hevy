import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExerciseChart = ({ exercise, data, isTimelineAdjusted }) => {
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
            label={{ value: '1RM (lbs)', angle: -90, position: 'insideLeft' }}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <Tooltip 
            labelFormatter={(value) => isTimelineAdjusted ? new Date(value).toLocaleDateString() : value}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="oneRM" 
            name="1RM" 
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