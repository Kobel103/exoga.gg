import { Router } from 'express';

const tournamentController = Router();
//Add services here in the future

tournamentController.get('/:state/:perPage', async (req, res) => {
  const { state, perPage } = req.params;
  const endpoint: string = 'https://api.start.gg/gql/alpha'; // Start.gg API Endpoint
  const startggAPIKey: string | undefined = process.env.START_GG_KEY; // Start.gg API Key
  if (!startggAPIKey) {
    console.error('API key is not configured');
    res.status(500).json({ error: 'API key is not configured' });
    return;
  }

  // Validate parameters
  const perPageNum = parseInt(perPage, 10);
  if (isNaN(perPageNum) || perPageNum <= 0 || perPageNum > 100) {
    res.status(400).json({ error: 'Invalid perPage parameter. Must be a number between 1 and 100.' });
    return;
  }

  if (!state || state.length !== 2) {
    res.status(400).json({ error: 'Invalid state parameter. Must be a 2-letter state code.' });
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${startggAPIKey}`
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
        variables: { perPage: perPageNum, state: state.toUpperCase() }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      res.status(500).json({ error: 'GraphQL query failed', details: data.errors });
      return;
    }

    if (!data.data) {
      res.status(500).json({ error: 'No data returned from API' });
      return;
    }

    console.log('API Response:', data.data);
    res.json(data.data);
  } catch (error) {
    console.error('Error connecting to the API:', error);
    res.status(500).json({
      error: 'Error connecting to the API',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

//Add wrap here for async error handling in the future
export default tournamentController;
