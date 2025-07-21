import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes/index';
import cors from 'cors';
import path from 'path';
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT ; 

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://your-production-domain.com']
  : ['http://localhost:5173'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Middleware
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', routes);


app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});

export default app;
