// // src/lib/db/index.ts
// import { drizzle } from 'drizzle-orm/better-sqlite3';
// import Database from 'better-sqlite3';
// import * as schema from './schema';

// const sqlite = new Database('abc.sqlite');
// export const db = drizzle(sqlite, { schema });

// // export const BuyerRepository = {
// //   getById: async (id: number) => { /* ... */ },
// //   update: async (id: number, data: any) => { /* ... */ },
// //   delete: async (id: number) => { /* ... */ },
// // };

// export const BuyerRepository = {
//   getById: async (id: string) => { // Change from number to string
//     // Your implementation using string ID
//   },
//   update: async (id: string, data: any) => { // Change from number to string
//     // Your implementation using string ID
//   },
//   delete: async (id: string) => { // Change from number to string
//     // Your implementation using string ID
//   },
// };


// // Ensure tables are created (run migrations)
// sqlite.exec(`
//   CREATE TABLE IF NOT EXISTS users (
//     id TEXT PRIMARY KEY,
//     email TEXT UNIQUE NOT NULL,
//     name TEXT,
//     created_at INTEGER DEFAULT (unixepoch()),
//     updated_at INTEGER DEFAULT (unixepoch())
//   );

//   CREATE TABLE IF NOT EXISTS buyers (
//     id TEXT PRIMARY KEY,
//     full_name TEXT NOT NULL,
//     email TEXT,
//     phone TEXT NOT NULL,
//     city TEXT NOT NULL,
//     property_type TEXT NOT NULL,
//     bhk TEXT,
//     purpose TEXT NOT NULL,
//     budget_min INTEGER,
//     budget_max INTEGER,
//     timeline TEXT NOT NULL,
//     source TEXT NOT NULL,
//     status TEXT NOT NULL DEFAULT 'New',
//     notes TEXT,
//     tags TEXT,
//     created_at INTEGER DEFAULT (unixepoch()),
//     updated_at INTEGER DEFAULT (unixepoch())
//   );

//   CREATE TABLE IF NOT EXISTS buyer_history (
//     id TEXT PRIMARY KEY,
//     buyer_id TEXT NOT NULL,
//     changed_by TEXT NOT NULL,
//     changed_at INTEGER DEFAULT (unixepoch()),
//     diff TEXT NOT NULL,
//     FOREIGN KEY (buyer_id) REFERENCES buyers (id)
//   );

//   -- Indexes
//   CREATE INDEX IF NOT EXISTS idx_buyers_city ON buyers(city);
//   CREATE INDEX IF NOT EXISTS idx_buyers_property_type ON buyers(property_type);
//   CREATE INDEX IF NOT EXISTS idx_buyers_status ON buyers(status);
//   CREATE INDEX IF NOT EXISTS idx_buyer_history_buyer_id ON buyer_history(buyer_id);
// `);


// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// For Vercel deployment, use an in-memory database
// This will reset on each function invocation, which is not ideal for production
// but will fix the immediate deployment issue
let db: ReturnType<typeof drizzle>;

if (process.env.NODE_ENV === 'development') {
  // Development: use local file
  const sqlite = new Database('abc.sqlite');
  db = drizzle(sqlite, { schema });
  
  // Create tables in development
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS buyers (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT,
      phone TEXT NOT NULL,
      city TEXT NOT NULL,
      property_type TEXT NOT NULL,
      bhk TEXT,
      purpose TEXT NOT NULL,
      budget_min INTEGER,
      budget_max INTEGER,
      timeline TEXT NOT NULL,
      source TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'New',
      notes TEXT,
      tags TEXT,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS buyer_history (
      id TEXT PRIMARY KEY,
      buyer_id TEXT NOT NULL,
      changed_by TEXT NOT NULL,
      changed_at INTEGER DEFAULT (unixepoch()),
      diff TEXT NOT NULL,
      FOREIGN KEY (buyer_id) REFERENCES buyers (id)
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_buyers_city ON buyers(city);
    CREATE INDEX IF NOT EXISTS idx_buyers_property_type ON buyers(property_type);
    CREATE INDEX IF NOT EXISTS idx_buyers_status ON buyers(status);
    CREATE INDEX IF NOT EXISTS idx_buyer_history_buyer_id ON buyer_history(buyer_id);
  `);
} else {
  // Production/Vercel: use in-memory database
  const sqlite = new Database(':memory:');
  db = drizzle(sqlite, { schema });
  
  // Create tables in memory (will be recreated on each function call)
  sqlite.exec(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE buyers (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT,
      phone TEXT NOT NULL,
      city TEXT NOT NULL,
      property_type TEXT NOT NULL,
      bhk TEXT,
      purpose TEXT NOT NULL,
      budget_min INTEGER,
      budget_max INTEGER,
      timeline TEXT NOT NULL,
      source TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'New',
      notes TEXT,
      tags TEXT,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE buyer_history (
      id TEXT PRIMARY KEY,
      buyer_id TEXT NOT NULL,
      changed_by TEXT NOT NULL,
      changed_at INTEGER DEFAULT (unixepoch()),
      diff TEXT NOT NULL,
      FOREIGN KEY (buyer_id) REFERENCES buyers (id)
    );

    -- Indexes
    CREATE INDEX idx_buyers_city ON buyers(city);
    CREATE INDEX idx_buyers_property_type ON buyers(property_type);
    CREATE INDEX idx_buyers_status ON buyers(status);
    CREATE INDEX idx_buyer_history_buyer_id ON buyer_history(buyer_id);
  `);
}

export { db };

export const BuyerRepository = {
  getById: async (id: string) => {
    // Your implementation using string ID
  },
  update: async (id: string, data: any) => {
    // Your implementation using string ID
  },
  delete: async (id: string) => {
    // Your implementation using string ID
  },
};