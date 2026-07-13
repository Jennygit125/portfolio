// src/server.ts
import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

// We will create this next, but let's import it now
import { AppDataSource } from './db/datasource';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Security & Utility Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Swagger Documentation Setup
/*const swaggerPath = path.join(__dirname, '../swagger.json');
if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = require(swaggerPath);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}*/

// Health Check
app.get('/health', (req: Request, res: Response) => {
  // #swagger.tags = ['System']
  // #swagger.description = 'Endpoint to check if the API is running.'
  res.status(200).json({ status: 'success', message: 'AutoLease API is live.' });
});

// Initialize Database and Start Server
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Endpoints list can bew found at http://localhost:${PORT}/routes `)
      console.log(`Docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });