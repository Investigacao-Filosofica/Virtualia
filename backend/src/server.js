import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import { connectDatabase } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/users', userRoutes);
app.use(errorHandler);

async function bootstrap() {
  try {
    await connectDatabase(process.env.MONGODB_URI);
    app.listen(port, () => {
      console.log(`Virtualia API listening on port ${port}`);
    });
  } catch (error) {
    console.error('[api] Unable to start server:', error);
    process.exit(1);
  }
}

bootstrap();
