import { apiRequest } from "./queryClient";
import type { SearchItemsRequest, Item, Category, Valuation, PriceHistory, MarketTrends } from "@shared/schema";
import type { ValuationResult, SearchSuggestion, TodayStats } from "../types";

export const api = {
  // Categories
  getCategories: (): Promise<Category[]> =>
    fetch("/api/categories").then(res => res.json()),

  // Items
  getItems: (): Promise<Item[]> =>
    fetch("/api/items").then(res => res.json()),

  getItem: (id: string): Promise<Item> =>
    fetch(`/api/items/${id}`).then(res => res.json()),

  searchItems: (params: SearchItemsRequest): Promise<Item[]> =>
    apiRequest("POST", "/api/items/search", params).then(res => res.json()),

  createItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> =>
    apiRequest("POST", "/api/items", item).then(res => res.json()),

  getSearchSuggestions: (query: string): Promise<SearchSuggestion[]> =>
    fetch(`/api/items/suggestions?q=${encodeURIComponent(query)}`).then(res => res.json()),

  // Valuations
  getValuation: (itemId: string): Promise<Valuation> =>
    fetch(`/api/valuations/${itemId}`).then(res => res.json()),

  createValuation: (valuation: Omit<Valuation, 'id' | 'createdAt'>): Promise<Valuation> =>
    apiRequest("POST", "/api/valuations", valuation).then(res => res.json()),

  getRecentValuations: (limit?: number): Promise<(Valuation & { item: Item })[]> =>
    fetch(`/api/valuations${limit ? `?limit=${limit}` : ''}`).then(res => res.json()),

  // Pricing Analysis
  analyzePricing: (params: {
    itemName: string;
    brand?: string;
    model?: string;
    condition?: string;
  }): Promise<ValuationResult> =>
    apiRequest("POST", "/api/pricing/analyze", params).then(res => res.json()),

  // Price History
  getPriceHistory: (itemId: string): Promise<PriceHistory[]> =>
    fetch(`/api/items/${itemId}/price-history`).then(res => res.json()),

  // Market Trends
  getMarketTrends: (categoryId?: string): Promise<MarketTrends[]> =>
    fetch(`/api/market-trends${categoryId ? `?categoryId=${categoryId}` : ''}`).then(res => res.json()),

  // Stats
  getTodayStats: (): Promise<TodayStats> =>
    fetch("/api/stats/today").then(res => res.json()),
};
