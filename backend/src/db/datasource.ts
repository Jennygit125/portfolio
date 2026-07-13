import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false, 
  logging: process.env.NODE_ENV === 'development',
  
  entities: ['src/controllers/entity.ts', 'dist/controllers/entity.js'],
  migrations: ['src/db/migrations/**/*.ts', 'dist/db/migrations/**/*.js'],
  subscribers: ['src/subscribers/**/*.ts', 'dist/subscribers/**/*.js'],
});