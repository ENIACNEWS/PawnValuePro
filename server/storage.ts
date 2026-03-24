import { type Category, type InsertCategory, type Item, type InsertItem, type Valuation, type InsertValuation, type PriceHistory, type InsertPriceHistory, type MarketTrends, type InsertMarketTrends, type SearchItemsRequest } from "@shared/schema";
import { categories, items, valuations, priceHistory, marketTrends } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, like, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Items
  getItems(): Promise<Item[]>;
  getItemById(id: string): Promise<Item | undefined>;
  searchItems(params: SearchItemsRequest): Promise<Item[]>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: string, item: Partial<InsertItem>): Promise<Item | undefined>;
  
  // Valuations
  getValuationByItemId(itemId: string): Promise<Valuation | undefined>;
  createValuation(valuation: InsertValuation): Promise<Valuation>;
  getRecentValuations(limit?: number): Promise<(Valuation & { item: Item })[]>;
  
  // Price History
  getPriceHistory(itemId: string): Promise<PriceHistory[]>;
  addPriceHistory(priceHistory: InsertPriceHistory): Promise<PriceHistory>;
  
  // Market Trends
  getMarketTrends(categoryId?: string): Promise<MarketTrends[]>;
  updateMarketTrends(trends: InsertMarketTrends): Promise<MarketTrends>;
  
  // Stats
  getTodayStats(): Promise<{
    itemsValued: number;
    totalValue: string;
    avgMargin: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize default categories if none exist
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    try {
      const existingCategories = await db.select().from(categories).limit(1);
      if (existingCategories.length === 0) {
        const defaultCategories = [
          {
            name: "Jewelry & Watches",
            icon: "fas fa-gem",
            description: "Gold, silver, diamonds, luxury watches, and precious stones",
          },
          {
            name: "Electronics",
            icon: "fas fa-laptop",
            description: "Smartphones, laptops, TVs, gaming consoles, and tech gadgets",
          },
          {
            name: "Vehicles",
            icon: "fas fa-car",
            description: "Cars, motorcycles, boats, ATVs, and automotive parts",
          },
          {
            name: "Musical Instruments",
            icon: "fas fa-guitar",
            description: "Guitars, keyboards, drums, amplifiers, and studio equipment",
          },
          {
            name: "Tools & Equipment",
            icon: "fas fa-hammer",
            description: "Power tools, hand tools, construction and industrial equipment",
          },
          {
            name: "Firearms",
            icon: "fas fa-crosshairs",
            description: "Rifles, handguns, shotguns, and shooting accessories",
          },
          {
            name: "Collectibles & Coins",
            icon: "fas fa-coins",
            description: "Rare coins, stamps, trading cards, and vintage memorabilia",
          },
          {
            name: "Sporting Goods",
            icon: "fas fa-football-ball",
            description: "Exercise equipment, outdoor gear, and sports memorabilia",
          },
          {
            name: "Art & Antiques",
            icon: "fas fa-palette",
            description: "Paintings, sculptures, antique furniture, and decorative arts",
          },
          {
            name: "Designer Items",
            icon: "fas fa-shopping-bag",
            description: "Luxury handbags, designer clothing, and high-end accessories",
          },
          {
            name: "Home Appliances",
            icon: "fas fa-blender",
            description: "Kitchen appliances, washers, dryers, and household equipment",
          },
          {
            name: "Cameras & Photography",
            icon: "fas fa-camera",
            description: "Digital cameras, lenses, drones, and photography equipment",
          },
          {
            name: "Lawn & Garden",
            icon: "fas fa-leaf",
            description: "Mowers, trimmers, chainsaws, and outdoor power equipment",
          },
          {
            name: "Power Equipment",
            icon: "fas fa-engine",
            description: "Generators, compressors, welders, and industrial machinery",
          },
          {
            name: "Precious Metals",
            icon: "fas fa-coins-stack",
            description: "Gold bars, silver coins, platinum, and bullion investments",
          },
        ];

        await db.insert(categories).values(defaultCategories);
        
        // Add sample items for testing
        await this.initializeSampleItems();
      }
    } catch (error) {
      console.warn('Error initializing default categories:', error);
    }
  }

  private async initializeSampleItems() {
    try {
      const existingItems = await db.select().from(items).limit(1);
      if (existingItems.length === 0) {
        const categoryList = await db.select().from(categories);
        const electronicsCategory = categoryList.find(c => c.name === "Electronics");
        const jewelryCategory = categoryList.find(c => c.name === "Jewelry & Watches");
        const vehiclesCategory = categoryList.find(c => c.name === "Vehicles");
        
        const sampleItems = [
          {
            name: "iPhone 14 Pro",
            brand: "Apple",
            model: "A2894",
            categoryId: electronicsCategory?.id,
            condition: "good",
            description: "128GB Space Black, unlocked",
            age: "1_3_years",
          },
          {
            name: "MacBook Pro",
            brand: "Apple",
            model: "M2",
            categoryId: electronicsCategory?.id,
            condition: "very_good",
            description: "13-inch, 8GB RAM, 256GB SSD",
            age: "under_1_year",
          },
          {
            name: "Samsung Galaxy S23",
            brand: "Samsung",
            model: "SM-S911U",
            categoryId: electronicsCategory?.id,
            condition: "excellent",
            description: "256GB Phantom Black, unlocked",
            age: "under_1_year",
          },
          {
            name: "Rolex Submariner",
            brand: "Rolex",
            model: "116610LN",
            categoryId: jewelryCategory?.id,
            condition: "very_good",
            description: "Black dial, ceramic bezel, 40mm",
            age: "3_5_years",
          },
          {
            name: "Gold Wedding Ring",
            brand: "Tiffany & Co",
            model: "Classic",
            categoryId: jewelryCategory?.id,
            condition: "good",
            description: "18k yellow gold, size 7",
            age: "5_years_plus",
          },
          {
            name: "Honda Civic",
            brand: "Honda",
            model: "LX",
            categoryId: vehiclesCategory?.id,
            condition: "good",
            description: "2020 sedan, 45k miles, clean title",
            age: "3_5_years",
          },
        ];

        await db.insert(items).values(sampleItems.filter(item => item.categoryId));
      }
    } catch (error) {
      console.warn('Error initializing sample items:', error);
    }
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await db.insert(categories).values(category).returning();
    return created;
  }

  async getItems(): Promise<Item[]> {
    return await db.select().from(items);
  }

  async getItemById(id: string): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item || undefined;
  }

  async searchItems(params: SearchItemsRequest): Promise<Item[]> {
    let query = db.select().from(items);
    const conditions = [];

    if (params.query) {
      const searchTerm = `%${params.query.toLowerCase()}%`;
      conditions.push(
        sql`LOWER(${items.name}) LIKE ${searchTerm} OR 
            LOWER(${items.brand}) LIKE ${searchTerm} OR 
            LOWER(${items.model}) LIKE ${searchTerm} OR 
            LOWER(${items.description}) LIKE ${searchTerm}`
      );
    }

    if (params.categoryId) {
      conditions.push(eq(items.categoryId, params.categoryId));
    }

    if (params.condition) {
      conditions.push(eq(items.condition, params.condition));
    }

    if (params.brand) {
      conditions.push(like(items.brand, `%${params.brand}%`));
    }

    if (params.age) {
      conditions.push(eq(items.age, params.age));
    }

    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }

    return await query;
  }

  async createItem(item: InsertItem): Promise<Item> {
    const [created] = await db.insert(items).values(item).returning();
    return created;
  }

  async updateItem(id: string, item: Partial<InsertItem>): Promise<Item | undefined> {
    const [updated] = await db.update(items).set(item).where(eq(items.id, id)).returning();
    return updated || undefined;
  }

  async getValuationByItemId(itemId: string): Promise<Valuation | undefined> {
    const [valuation] = await db.select().from(valuations).where(eq(valuations.itemId, itemId));
    return valuation || undefined;
  }

  async createValuation(valuation: InsertValuation): Promise<Valuation> {
    const [created] = await db.insert(valuations).values(valuation).returning();
    return created;
  }

  async getRecentValuations(limit: number = 10): Promise<(Valuation & { item: Item })[]> {
    const result = await db
      .select()
      .from(valuations)
      .leftJoin(items, eq(valuations.itemId, items.id))
      .orderBy(desc(valuations.createdAt))
      .limit(limit);

    return result.map(row => ({
      ...row.valuations,
      item: row.items!,
    })).filter(v => v.item);
  }

  async getPriceHistory(itemId: string): Promise<PriceHistory[]> {
    return await db.select().from(priceHistory).where(eq(priceHistory.itemId, itemId)).orderBy(desc(priceHistory.recordedAt));
  }

  async addPriceHistory(price: InsertPriceHistory): Promise<PriceHistory> {
    const [created] = await db.insert(priceHistory).values(price).returning();
    return created;
  }

  async getMarketTrends(categoryId?: string): Promise<MarketTrends[]> {
    if (categoryId) {
      return await db.select().from(marketTrends).where(eq(marketTrends.categoryId, categoryId));
    }
    return await db.select().from(marketTrends);
  }

  async updateMarketTrends(trends: InsertMarketTrends): Promise<MarketTrends> {
    const [created] = await db.insert(marketTrends).values(trends).returning();
    return created;
  }

  async getTodayStats(): Promise<{
    itemsValued: number;
    totalValue: string;
    avgMargin: string;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayValuations = await db
      .select()
      .from(valuations)
      .where(gte(valuations.createdAt, today));

    const totalValue = todayValuations.reduce((sum, v) => sum + parseFloat(v.marketValue), 0);
    const avgMargin = todayValuations.length > 0 
      ? todayValuations.reduce((sum, v) => sum + parseFloat(v.marginPercentage), 0) / todayValuations.length 
      : 0;

    return {
      itemsValued: todayValuations.length,
      totalValue: `$${totalValue.toLocaleString()}`,
      avgMargin: `${avgMargin.toFixed(1)}%`,
    };
  }
}

export const storage = new DatabaseStorage();
