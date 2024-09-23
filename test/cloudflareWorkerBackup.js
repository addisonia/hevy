export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      const apiUrl = 'https://api.hevyapp.com/v1/workouts';
      
      // Use HEVY_API_KEY by default, only use SHARMA_API_KEY if specifically requested
      let apiKey = env.HEVY_API_KEY;
      if (url.pathname.startsWith('/friend-endpoint')) {
        apiKey = env.SHARMA_API_KEY;
      }
  
      // Construct the Hevy API URL with query parameters
      const hevyUrl = new URL(apiUrl);
      for (const [key, value] of url.searchParams) {
        hevyUrl.searchParams.append(key, value);
      }
  
      const response = await fetch(hevyUrl, {
        headers: {
          'api-key': apiKey,
        },
      });
  
      // Clone the response so that it's no longer immutable
      const newResponse = new Response(response.body, response);
  
      // Add CORS headers
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, api-key');
  
      return newResponse;
    },
  };