// api.js

const CACHE_KEY_PREFIX = 'workouts_cache_';
const LAST_FETCH_KEY_PREFIX = 'last_fetch_timestamp_';

const getFromCache = (endpoint) => {
  const cached = localStorage.getItem(CACHE_KEY_PREFIX + endpoint);
  return cached ? JSON.parse(cached) : null;
};

const setToCache = (endpoint, data) => {
  localStorage.setItem(CACHE_KEY_PREFIX + endpoint, JSON.stringify(data));
};

const getLastFetchTimestamp = (endpoint) => {
  return localStorage.getItem(LAST_FETCH_KEY_PREFIX + endpoint) || '0';
};

const setLastFetchTimestamp = (endpoint, timestamp) => {
  localStorage.setItem(LAST_FETCH_KEY_PREFIX + endpoint, timestamp);
};

const fetchNewWorkouts = async (lastFetchTimestamp, endpoint = '') => {
  let allNewWorkouts = [];
  let page = 1;
  let hasMoreData = true;

  while (hasMoreData) {
    try {
      const response = await fetch(`https://hevy-proxy.ajatkin.workers.dev${endpoint}/workouts?page=${page}&pageSize=10&after=${lastFetchTimestamp}`);

      if (response.status === 404) {
        hasMoreData = false;
        break;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      allNewWorkouts = [...allNewWorkouts, ...(data.workouts || [])];
      
      if (data.workouts.length < 10) {
        hasMoreData = false;
      } else {
        page++;
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      hasMoreData = false;
    }
  }

  return allNewWorkouts;
};

export const fetchWorkouts = async (endpoint = '') => {
  const cachedWorkouts = getFromCache(endpoint);
  const lastFetchTimestamp = getLastFetchTimestamp(endpoint);
  const currentTimestamp = Date.now().toString();

  let newWorkouts = await fetchNewWorkouts(lastFetchTimestamp, endpoint);

  let allWorkouts;
  if (cachedWorkouts) {
    // Merge new workouts with cached workouts
    allWorkouts = [...newWorkouts, ...cachedWorkouts];
    // Remove duplicates based on workout ID
    allWorkouts = allWorkouts.filter((workout, index, self) =>
      index === self.findIndex((t) => t.id === workout.id)
    );
    // Sort workouts by date (newest first)
    allWorkouts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else {
    allWorkouts = newWorkouts;
  }

  setToCache(endpoint, allWorkouts);
  setLastFetchTimestamp(endpoint, currentTimestamp);

  return allWorkouts;
};