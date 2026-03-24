import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pricingService } from "./services/pricingService";
import { searchItemsSchema, insertItemSchema, insertValuationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  // Items
  app.get("/api/items", async (req, res) => {
    try {
      const items = await storage.getItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch items' });
    }
  });

  app.get("/api/items/suggestions", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 2) {
        return res.json([]);
      }
      
      const items = await storage.searchItems({ query });
      const suggestions = items.slice(0, 10).map(item => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        model: item.model,
        categoryId: item.categoryId,
      }));
      
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suggestions" });
    }
  });

  app.get("/api/items/:id", async (req, res) => {
    try {
      const item = await storage.getItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch item' });
    }
  });

  app.post("/api/items/search", async (req, res) => {
    try {
      const searchParams = searchItemsSchema.parse(req.body);
      const items = await storage.searchItems(searchParams);
      res.json(items);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid search parameters', errors: error.errors });
      }
      res.status(500).json({ message: 'Search failed' });
    }
  });

  app.post("/api/items", async (req, res) => {
    try {
      const itemData = insertItemSchema.parse(req.body);
      const item = await storage.createItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid item data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create item' });
    }
  });

  // Valuations
  app.get("/api/valuations/:itemId", async (req, res) => {
    try {
      const valuation = await storage.getValuationByItemId(req.params.itemId);
      if (!valuation) {
        return res.status(404).json({ message: 'Valuation not found' });
      }
      res.json(valuation);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch valuation' });
    }
  });

  app.post("/api/valuations", async (req, res) => {
    try {
      const valuationData = insertValuationSchema.parse(req.body);
      const valuation = await storage.createValuation(valuationData);
      res.status(201).json(valuation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid valuation data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create valuation' });
    }
  });

  app.get("/api/valuations", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const recentValuations = await storage.getRecentValuations(limit);
      res.json(recentValuations);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch recent valuations' });
    }
  });

  // Price Analysis
  app.post("/api/pricing/analyze", async (req, res) => {
    try {
      const { itemName, brand, model, condition } = req.body;
      
      if (!itemName) {
        return res.status(400).json({ message: 'Item name is required' });
      }

      const valuation = await pricingService.getItemValuation(itemName, brand, model, condition);
      res.json(valuation);
    } catch (error) {
      console.error('Pricing analysis error:', error);
      res.status(500).json({ message: 'Failed to analyze pricing' });
    }
  });

  // Price History
  app.get("/api/items/:itemId/price-history", async (req, res) => {
    try {
      const priceHistory = await storage.getPriceHistory(req.params.itemId);
      res.json(priceHistory);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch price history' });
    }
  });

  // Market Trends
  app.get("/api/market-trends", async (req, res) => {
    try {
      const categoryId = req.query.categoryId as string;
      const trends = await storage.getMarketTrends(categoryId);
      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch market trends' });
    }
  });

  // Stats
  app.get("/api/stats/today", async (req, res) => {
    try {
      const stats = await storage.getTodayStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch today\'s stats' });
    }
  });

  // Auto-complete for search
  app.get("/api/items/suggestions", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 2) {
        return res.json([]);
      }

      const items = await storage.searchItems({ query });
      const suggestions = items.slice(0, 5).map(item => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        model: item.model,
        categoryId: item.categoryId,
      }));
      
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch suggestions' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
