import { MikroORM } from '@mikro-orm/core';

export default {
  entities: ['./dist/entities'], 
  entitiesTs: ['./src/entities'],
  dbName: 'transactionDB', 
  type: 'postgresql', 
  user: 'postgres', 
  password: 'rootUser', 
  host: 'localhost', 
  port: 5432, 
  debug: true, 
  migrations: {
    path: './src/migrations', // Directory for migrations
    pathTs: './src/migrations', // Path for TS migration files
  },
 
} as Parameters<typeof MikroORM.init>[0];
