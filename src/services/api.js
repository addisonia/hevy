// api.js

const CACHE_DURATION = 300000; // 5 mins

const getFromCache = (key) => {
  const cached = localStorage.getItem(key);
  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  return null;
};

const setToCache = (key, data) => {
  localStorage.setItem(key, JSON.stringify({
    timestamp: Date.now(),
    data: data
  }));
};

export const fetchWorkouts = async (endpoint = '') => {
  const cacheKey = `workouts${endpoint}`;
  const cachedData = getFromCache(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  let allWorkouts = [];
  let page = 1;
  let hasMoreData = true;

  while (hasMoreData) {
    const response = await fetch(`https://hevy-proxy.ajatkin.workers.dev${endpoint}/workouts?page=${page}&pageSize=10`);

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

  setToCache(cacheKey, allWorkouts);
  return allWorkouts;
};