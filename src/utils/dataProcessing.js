const kgToLbs = (kg) => kg * 2.20462;

const calculate1RM = (weight, reps) => {
  return weight * (1 + reps / 30);
};

export const isBodyweightExercise = (exercise) => {
  const bodyweightExercises = [
    'Pull Up', 'Dip', 'Push Up', 'Sit Up', 'Chin Up',
    'Leg Raise', 'Hanging Leg Raise', 'Pull-up', 'Muscle Up', 'Pullup',
    'Front Lever Raise', 'Lying Leg Raise', 'Crunch'
  ];
  return bodyweightExercises.some(bwExercise => 
    exercise.toLowerCase().includes(bwExercise.toLowerCase()) && 
    !exercise.toLowerCase().includes('weighted') &&
    !exercise.toLowerCase().includes('machine')
  );
};

export const isDurationExercise = (exercise) => {
    const durationExercises = [
      'Plank', 'Hold', 'Hang', 'Horse Squat', 'Front Lever Hold', 'Air Bike'
    ];
    return durationExercises.some(durExercise => 
      exercise.toLowerCase().includes(durExercise.toLowerCase())
    );
};

export const processExerciseData = (workouts) => {
  const exerciseData = {};

  workouts.forEach(workout => {
    const workoutDate = new Date(workout.created_at).toLocaleDateString();
    
    workout.exercises.forEach(exercise => {
      if (!exerciseData[exercise.title]) {
        exerciseData[exercise.title] = [];
      }
      
      let value;
      if (isBodyweightExercise(exercise.title)) {
        value = Math.max(...exercise.sets.map(set => parseInt(set.reps) || 0));
      } else if (isDurationExercise(exercise.title)) {
        value = Math.max(...exercise.sets.map(set => parseInt(set.duration_seconds) || 0));
      } else {
        const max1RM = exercise.sets.reduce((max, set) => {
          const weight = kgToLbs(parseFloat(set.weight_kg) || 0);
          const reps = parseInt(set.reps) || 0;
          const oneRM = calculate1RM(weight, reps);
          return oneRM > max ? oneRM : max;
        }, 0);
        value = Math.round(max1RM);
      }

      exerciseData[exercise.title].push({
        date: workoutDate,
        value: value
      });
    });
  });

  // Sort data points by date for each exercise
  Object.keys(exerciseData).forEach(exercise => {
    exerciseData[exercise].sort((a, b) => new Date(a.date) - new Date(b.date));
  });

  return exerciseData;
};

export const adjustTimelineData = (exerciseData) => {
  const adjustedData = {};

  Object.keys(exerciseData).forEach(exercise => {
    adjustedData[exercise] = exerciseData[exercise].map(entry => ({
      date: new Date(entry.date).getTime(), // Convert to Unix timestamp
      value: entry.value
    }));
  });

  return adjustedData;
};