import express, { Express } from 'express';
import dotenv from 'dotenv';
import { setupSwagger } from './docs/swagger';
import routes from './routes/index';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT ;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
