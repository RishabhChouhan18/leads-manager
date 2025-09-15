// import { sql } from 'drizzle-orm';
// import { integer, sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

// export const users = sqliteTable('users', {
//   id: text('id').primaryKey(),
//   email: text('email').unique().notNull(),
//   name: text('name'),
//   createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
//   updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
// });

// export const buyers = sqliteTable('buyers', {
//   id: text('id').primaryKey(),
//   fullName: text('full_name').notNull(),
//   email: text('email'),
//   phone: text('phone').notNull(),
//   city: text('city').notNull(), // 'Chandigarh|Mohali|Zirakpur|Panchkula|Other'
//   propertyType: text('property_type').notNull(), // 'Apartment|Villa|Plot|Office|Retail'
//   bhk: text('bhk'), // '1|2|3|4|Studio'
//   purpose: text('purpose').notNull(), // 'Buy|Rent'
//   budgetMin: integer('budget_min'),
//   budgetMax: integer('budget_max'),
//   timeline: text('timeline').notNull(), // '0-3m|3-6m|>6m|Exploring'
//   source: text('source').notNull(), // 'Website|Referral|Walk-in|Call|Other'
//   status: text('status').notNull().default('New'), // 'New|Qualified|Contacted|Visited|Negotiation|Converted|Dropped'
//   notes: text('notes'),
//   tags: text('tags'), // JSON string array
//   ownerId: text('owner_id').references(() => users.id).notNull(),
//   createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
//   updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
// });

// export const buyerHistory = sqliteTable('buyer_history', {
//   id: text('id').primaryKey(),
//   buyerId: text('buyer_id').references(() => buyers.id).notNull(),
//   changedBy: text('changed_by').references(() => users.id).notNull(),
//   changedAt: integer('changed_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
//   diff: text('diff').notNull(), // JSON string of changed fields
// });

// export type User = typeof users.$inferSelect;
// export type NewUser = typeof users.$inferInsert;
// export type Buyer = typeof buyers.$inferSelect;
// export type NewBuyer = typeof buyers.$inferInsert;
// export type BuyerHistory = typeof buyerHistory.$inferSelect;
// export type NewBuyerHistory = typeof buyerHistory.$inferInsert;

// src/lib/db/schema.ts
// import { sql } from 'drizzle-orm';
// import { integer, sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

// export const users = sqliteTable('users', {
//   id: text('id').primaryKey(),
//   email: text('email').unique().notNull(),
//   name: text('name'),
//   createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
//   updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
// });

// export const buyers = sqliteTable('buyers', {
//   id: text('id').primaryKey(),
//   fullName: text('full_name').notNull(),
//   email: text('email'),
//   phone: text('phone').notNull(),
//   city: text('city').notNull(), // 'Chandigarh|Mohali|Zirakpur|Panchkula|Other'
//   propertyType: text('property_type').notNull(), // 'Apartment|Villa|Plot|Office|Retail'
//   bhk: text('bhk'), // '1|2|3|4|Studio'
//   purpose: text('purpose').notNull(), // 'Buy|Rent'
//   budgetMin: integer('budget_min'),
//   budgetMax: integer('budget_max'),
//   timeline: text('timeline').notNull(), // '0-3m|3-6m|>6m|Exploring'
//   source: text('source').notNull(), // 'Website|Referral|Walk-in|Call|Other'
//   status: text('status').notNull().default('New'), // 'New|Qualified|Contacted|Visited|Negotiation|Converted|Dropped'
//   notes: text('notes'),
//   tags: text('tags'), // JSON string array
//   ownerId: text('owner_id').notNull().default('anonymous'), // No auth required, default to anonymous
//   createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
//   updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
// });

// export const buyerHistory = sqliteTable('buyer_history', {
//   id: text('id').primaryKey(),
//   buyerId: text('buyer_id').references(() => buyers.id).notNull(),
//   changedBy: text('changed_by').notNull().default('anonymous'), // No auth required
//   changedAt: integer('changed_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
//   diff: text('diff').notNull(), // JSON string of changed fields
// });

// export type User = typeof users.$inferSelect;
// export type NewUser = typeof users.$inferInsert;
// export type Buyer = typeof buyers.$inferSelect;
// export type NewBuyer = typeof buyers.$inferInsert;
// export type BuyerHistory = typeof buyerHistory.$inferSelect;
// export type NewBuyerHistory = typeof buyerHistory.$inferInsert;

import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, real } from 'drizzle-orm/sqlite-core';


// export const users = sqliteTable('users', {
//   id: text('id').primaryKey(),
//   email: text('email').unique().notNull(),
//   name: text('name'),
//   createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
//   updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
// });

export const buyers = sqliteTable('buyers', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  city: text('city').notNull(), // 'Chandigarh|Mohali|Zirakpur|Panchkula|Other'
  propertyType: text('property_type').notNull(), // 'Apartment|Villa|Plot|Office|Retail'
  bhk: text('bhk'), // '1|2|3|4|Studio'
  purpose: text('purpose').notNull(), // 'Buy|Rent'
  budgetMin: integer('budget_min'),
  budgetMax: integer('budget_max'),
  timeline: text('timeline').notNull(), // '0-3m|3-6m|>6m|Exploring'
  source: text('source').notNull(), // 'Website|Referral|Walk-in|Call|Other'
  status: text('status').notNull().default('New'), // 'New|Qualified|Contacted|Visited|Negotiation|Converted|Dropped'
  notes: text('notes'),
  tags: text('tags'), // JSON string array
  // ownerId: text('owner_id').notNull(), // Removed .references() for now
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const buyerHistory = sqliteTable('buyer_history', {
  id: text('id').primaryKey(),
  buyerId: text('buyer_id').notNull(), // Removed .references() for now
  changedBy: text('changed_by').notNull(), // Removed .references() for now
  changedAt: integer('changed_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  diff: text('diff').notNull(), // JSON string of changed fields
});

// export type User = typeof users.$inferSelect;
// export type NewUser = typeof users.$inferInsert;
export type Buyer = typeof buyers.$inferSelect;
export type NewBuyer = typeof buyers.$inferInsert;
export type BuyerHistory = typeof buyerHistory.$inferSelect;
export type NewBuyerHistory = typeof buyerHistory.$inferInsert;