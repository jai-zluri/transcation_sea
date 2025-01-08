import { MikroORM } from '@mikro-orm/core';
import 'reflect-metadata';

import mikroOrmConfig from './mikro-orm.config';


const main = async () => {
  try {
    // Initialize MikroORM
    const orm = await MikroORM.init(mikroOrmConfig);

    // Sync schema with the database
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema(); // Ensure tables and schema match the entities

    console.log('Mikro ORM initialized and schema updated!');
  } catch (err) {
    console.error('Error during Mikro ORM initialization:', err);
  }
};

main();

