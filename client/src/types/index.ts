export interface PricingData {
  source: string;
  price: number;
  confidence: number;
  lastUpdated: Date;
}

export interface ValuationResult {
  marketValue: number;
  recommendedOffer: number;
  profitMargin: number;
  marginPercentage: number;
  dataSources: PricingData[];
  confidence: number;
}

export interface SearchSuggestion {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  categoryId?: string;
}

export interface TodayStats {
  itemsValued: number;
  totalValue: string;
  avgMargin: string;
}

export interface ChartDataPoint {
  date: string;
  price: number;
  source: string;
}
