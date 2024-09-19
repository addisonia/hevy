const kgToLbs = (kg) => kg * 2.20462;

const calculate1RM = (weight, reps) => {
  return weight * (1 + reps / 30);
};

export const processExerciseData = (workouts) => {
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