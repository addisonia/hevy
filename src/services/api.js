// api.js

const fetchAllWorkouts = async (endpoint = '') => {
  let allWorkouts = [];
  let page = 1;

  try {
    const firstResponse = await fetch(`https://hevy-proxy.ajatkin.workers.dev${endpoint}/workouts?page=${page}&pageSize=10`);

    if (!firstResponse.ok) {
      throw new Error(`HTTP error! status: ${firstResponse.status}`);
    }

    const firstData = await firstResponse.json();
    allWorkouts = [...(firstData.workouts || [])];

    const totalPages = firstData.page_count;

    // Generate an array of fetch promises for the remaining pages
    const fetchPromises = [];
    for (let i = 2; i <= totalPages; i++) {
      fetchPromises.push(
        fetch(`https://hevy-proxy.ajatkin.workers.dev${endpoint}/workouts?page=${i}&pageSize=10`)
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => data.workouts || [])
          .catch(error => {
            console.error('Error fetching workouts:', error);
            return [];
          })
      );
    }

    // Wait for all fetches to complete
    const results = await Promise.all(fetchPromises);
    results.forEach(workouts => {
      allWorkouts = [...allWorkouts, ...workouts];
    });

    // Sort workouts by date (newest first)
    allWorkouts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  } catch (error) {
    console.error('Error fetching workouts:', error);
  }

  return allWorkouts;
};

export const fetchWorkouts = async (endpoint = '') => {
  const allWorkouts = await fetchAllWorkouts(endpoint);
  return allWorkouts;
};
