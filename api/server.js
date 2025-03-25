import dotenv from 'dotenv';
dotenv.config(); // Load the .env file

import express from 'express';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = 3000;

const endpoint = 'https://api.start.gg/gql/alpha'; // Use const for endpoint

const apiKey = process.env.START_GG_KEY; // Use const for apiKey
console.log('API key:', apiKey);

app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API d\'ExoStats!');
});

app.get('/api/tournois/:state/:perPage', async (req, res) => {
  const { state, perPage } = req.params; // Use destructuring to get the state and perPage parameters
  console.log('Request parameters:', { state, perPage });
  try {
    let result = {};
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`, // Use template literals for the Authorization header
      },
      body: JSON.stringify({
        query: `
          query TournamentsByState($perPage: Int, $state: String!) {
            tournaments(query: {
              perPage: $perPage
              filter: {
                addrState: $state
              }
            }) {
              nodes {
                id
                name
                addrState
              }
            }
          }
        `,
        operationName: 'TournamentsByState',
        variables: { perPage: parseInt(perPage), state: state.toUpperCase() },
      }),
    }).then(r => r.json())
    .then(data => {
      console.log(data);
      result = data.data;
    });
    res.json(result);
  } catch (error) {
    console.error('Error connecting to the API:', error);
    res.status(500).send('Error connecting to the API');
  }
});

app.listen(port, () => {
  console.log(`L'API ExoStats a été démarré sur l'URL http://localhost:${port}`);
});