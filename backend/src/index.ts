import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { User } from './entities/user';

async function main() {
  // Load MikroORM configuration
  const orm = await MikroORM.init({
    entities: [User],
    dbName: 'your_database_name',
    user: 'your_database_user',
    password: 'your_database_password',
    host: 'localhost',
    port: 5432,
    debug: true,
    migrations: {
      path: path.join(__dirname, './migrations'),
      tableName: 'mikro_orm_migrations',
    },
  });

  // Now MikroORM is initialized
  console.log('MikroORM connected to PostgreSQL');

  // Close ORM on exit
  process.on('exit', async () => {
    await orm.close(true);
  });
}

main().catch(console.error);






