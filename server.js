const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());

const HEVY_API_KEY = process.env.REACT_APP_HEVY_API_KEY;

app.get('/api/workouts', async (req, res) => {
  try {
    const response = await axios.get('https://api.hevyapp.com/v1/workouts', {
      headers: {
        'api-key': HEVY_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from Hevy API:', error);
    res.status(500).json({ error: 'An error occurred while fetching data from Hevy API' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));