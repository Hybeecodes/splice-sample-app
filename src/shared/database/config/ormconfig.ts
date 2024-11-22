import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const environmentConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  dbPort: parseInt(process.env.DB_PORT) || 5432,
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || 'password',
  dbName: process.env.DB_NAME || 'db',
  dbHost: process.env.DB_HOST || 'localhost',
};

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: environmentConfig.dbHost,
  port: environmentConfig.dbPort,
  username: environmentConfig.dbUser,
  password: environmentConfig.dbPassword,
  database: environmentConfig.dbName,
  synchronize: false,
  logging: environmentConfig.nodeEnv !== 'production',
  autoLoadEntities: true,
  migrations: ['dist/shared/database/migrations/*.js'],
  migrationsRun: true,
} as DataSourceOptions);
