// import type { Config } from 'drizzle-kit';

// export default {
//   schema: './src/lib/db/schema.ts',
//   out: './migrations',
//   driver: 'd1-http',
//   dialect: 'sqlite',
//   dbCredentials: {
//     url: './sqlite.db',
//   },
// } satisfies Config;

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './abc.sqlite',
  },
});