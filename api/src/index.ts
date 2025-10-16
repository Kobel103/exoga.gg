import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import i18nextMiddleware from 'i18next-http-middleware';
import './app/common/i18n/i18n'; // Import the i18n configuration
import { i18next } from './app/common/i18n/i18n';
import tournamentContoller from './app/controllers/tournamentController';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:' + PORT).split(',');

app.use(cors({ origin: corsOrigins }));
app.use(json());

// Use i18next middleware (the i18n configuration is loaded by the import above)
app.use(i18nextMiddleware.handle(i18next));

// Add request logging middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

const initializeApp = async (): Promise<void> => {
  try {
    // Add database instance here in the future
    // await Database.initInstance();

    const apiRouter = express.Router();
    apiRouter.use('/tournois', tournamentContoller);
    app.use('/api', apiRouter);

    // Root route
    app.get('/', (req: express.Request, res: express.Response) => {
      res.send(i18next.t('welcome', { lng: 'en' }));
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`L'API ExoStats a été démarré sur l'URL http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  }
};

// Initialize the application
initializeApp();

export default app; // For testing purposes
