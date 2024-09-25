// api.js

const CACHE_KEY_PREFIX = 'workouts_cache_';

const getFromCache = (endpoint) => {
  const cached = localStorage.getItem(CACHE_KEY_PREFIX + endpoint);
  return cached ? JSON.parse(cached) : null;
};

const setToCache = (endpoint, data) => {
  localStorage.setItem(CACHE_KEY_PREFIX + endpoint, JSON.stringify(data));
};

const fetchNewWorkouts = async (endpoint = '') => {
  let allNewWorkouts = [];
  let page = 1;

  try {
    const firstResponse = await fetch(`https://hevy-proxy.ajatkin.workers.dev${endpoint}/workouts?page=${page}&pageSize=10`);
    
    if (!firstResponse.ok) {
      throw new Error(`HTTP error! status: ${firstResponse.status}`);
    }

    const firstData = await firstResponse.json();
    allNewWorkouts = [...(firstData.workouts || [])];

    const totalPages = firstData.page_count;

    // Generate an array of fetch promises for the remaining pages
    const fetchPromises = [];
    for (let i = 2; i <= totalPages; i++) {
      fetchPromises.push(
        fetch(`https://hevy-proxy.ajatkin.workers.dev${endpoint}/workouts?page=${i}&pageSize=10`)
          .then(res => res.json())
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
      allNewWorkouts = [...allNewWorkouts, ...workouts];
    });

  } catch (error) {
    console.error('Error fetching workouts:', error);
  }

  return allNewWorkouts;
};

export const fetchWorkouts = async (endpoint = '') => {
  let allWorkouts = getFromCache(endpoint);

  // If cache is empty, fetch from API
  if (!allWorkouts || allWorkouts.length === 0) {
    allWorkouts = await fetchNewWorkouts(endpoint);

    // Sort workouts by date (newest first)
    allWorkouts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setToCache(endpoint, allWorkouts);
  }

  return allWorkouts;
};
