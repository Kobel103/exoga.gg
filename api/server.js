require('dotenv').config(); // Load the .env file
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const apiKey = process.env.START_GG_KEY; // Use const for apiKey

app.get('/', (req, res) => {
  res.send('Exo Stats real');
});

// Example route to connect to an external API
app.get('/api/matchupCheckVOL2', async (req, res) => {
  try {
    const response = await axios.get('https://www.start.gg/tournament/matchup-check-vol-2/event/ultimate-singles', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error connecting to the API:', error);
    res.status(500).send('Error connecting to the API');
  }
});

app.listen(port, () => {
  console.log(`My boi be listening at http://localhost:${port}`);
});

