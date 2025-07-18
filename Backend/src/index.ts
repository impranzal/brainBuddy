import express, { Express } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
