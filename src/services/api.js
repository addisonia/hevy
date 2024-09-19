export const fetchWorkouts = async () => {
    let allWorkouts = [];
    let page = 1;
    let hasMoreData = true;
  
    while (hasMoreData) {
      const response = await fetch(`https://hevy-proxy.ajatkin.workers.dev/workouts?page=${page}&pageSize=10`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      allWorkouts = [...allWorkouts, ...(data.workouts || [])];
      
      if (data.workouts.length < 10) {
        hasMoreData = false;
      } else {
        page++;
      }
    }
  
    return allWorkouts;
  };