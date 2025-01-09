// mikro-orm.config.ts
import { defineConfig } from '@mikro-orm/core';

export default defineConfig({
  entities: ['./entities'],
  dbName: 'transcationDB',
  user: 'transcationDB_owner',
  password: 'kxKnWf5Xt0Id',
  type: 'postgresql',
});

