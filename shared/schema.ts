import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  description: text("description"),
  itemCount: integer("item_count").default(0),
});

export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  brand: text("brand"),
  model: text("model"),
  categoryId: varchar("category_id").references(() => categories.id),
  condition: text("condition").notNull(), // excellent, very_good, good, fair, poor
  description: text("description"),
  specifications: jsonb("specifications"), // JSON object for flexible specs
  imageUrl: text("image_url"),
  barcode: text("barcode"),
  sku: text("sku"),
  age: text("age"), // under_1_year, 1_3_years, 3_5_years, 5_years_plus, vintage
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const valuations = pgTable("valuations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").references(() => items.id),
  marketValue: decimal("market_value", { precision: 10, scale: 2 }).notNull(),
  recommendedOffer: decimal("recommended_offer", { precision: 10, scale: 2 }).notNull(),
  profitMargin: decimal("profit_margin", { precision: 10, scale: 2 }).notNull(),
  marginPercentage: decimal("margin_percentage", { precision: 5, scale: 2 }).notNull(),
  dataSources: jsonb("data_sources"), // Array of pricing sources with values
  confidence: integer("confidence").default(85), // Confidence score 0-100
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const priceHistory = pgTable("price_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").references(() => items.id),
  source: text("source").notNull(), // ebay, edmunds, priceapi, amazon, etc.
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const marketTrends = pgTable("market_trends", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").references(() => categories.id),
  itemId: varchar("item_id").references(() => items.id),
  trend7d: decimal("trend_7d", { precision: 5, scale: 2 }),
  trend30d: decimal("trend_30d", { precision: 5, scale: 2 }),
  volatility: text("volatility"), // low, medium, high
  averagePrice: decimal("average_price", { precision: 10, scale: 2 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  itemCount: true,
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertValuationSchema = createInsertSchema(valuations).omit({
  id: true,
  createdAt: true,
});

export const insertPriceHistorySchema = createInsertSchema(priceHistory).omit({
  id: true,
  recordedAt: true,
});

export const insertMarketTrendsSchema = createInsertSchema(marketTrends).omit({
  id: true,
  updatedAt: true,
});

// Search schema
export const searchItemsSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  condition: z.enum(["excellent", "very_good", "good", "fair", "poor"]).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  age: z.enum(["under_1_year", "1_3_years", "3_5_years", "5_years_plus", "vintage"]).optional(),
  brand: z.string().optional(),
});

// Types
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;

export type Valuation = typeof valuations.$inferSelect;
export type InsertValuation = z.infer<typeof insertValuationSchema>;

export type PriceHistory = typeof priceHistory.$inferSelect;
export type InsertPriceHistory = z.infer<typeof insertPriceHistorySchema>;

export type MarketTrends = typeof marketTrends.$inferSelect;
export type InsertMarketTrends = z.infer<typeof insertMarketTrendsSchema>;

export type SearchItemsRequest = z.infer<typeof searchItemsSchema>;
