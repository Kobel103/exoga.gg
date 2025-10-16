import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import i18nextMiddleware from 'i18next-http-middleware';
import './app/common/i18n/i18n'; // Import the i18n configuration
import { TournamentDTO } from './app/dtos/tournamentDTO';
import { i18next } from './app/common/i18n/i18n';

// Load environment variables
dotenv.config();

const app = express();

const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:4200,http://fe.local').split(',');
app.use(cors({ origin: corsOrigins }));

app.use(json());

// Use i18next middleware (the i18n configuration is loaded by the import above)
app.use(i18nextMiddleware.handle(i18next));

const port: number = parseInt(process.env.PORT || '3000', 10);

const endpoint: string = 'https://api.start.gg/gql/alpha'; // Start.gg API Endpoint
const apiKey: string | undefined = process.env.START_GG_KEY; // Start.gg API Key

interface StartGGResponse {
  data?: {
    tournaments: {
      nodes: TournamentDTO[];
    };
  };
  errors?: Array<{ message: string }>;
}

app.get('/', (req: express.Request, res: express.Response) => {
  res.send("Bienvenue sur l'API d'ExoStats!");
});

app.get('/api/tournois/:state/:perPage', async (req: express.Request, res: express.Response) => {
  const { state, perPage } = req.params;
  console.log('Request parameters:', { state, perPage });

  if (!apiKey) {
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
        Authorization: `Bearer ${apiKey}`
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

    const data: StartGGResponse = await response.json();

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

app.listen(port, () => {
  console.log(`L'API ExoStats a été démarré sur l'URL http://localhost:${port}`);
});
