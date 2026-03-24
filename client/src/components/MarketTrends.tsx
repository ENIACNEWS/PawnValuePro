import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/lib/api";
import PriceChart from "./PriceChart";

interface MarketTrendsProps {
  categoryId?: string;
}

export default function MarketTrends({ categoryId }: MarketTrendsProps) {
  const { data: trends = [], isLoading } = useQuery({
    queryKey: ["/api/market-trends", categoryId],
    queryFn: () => api.getMarketTrends(categoryId),
  });

  const { data: recentValuations = [], isLoading: loadingValuations } = useQuery({
    queryKey: ["/api/valuations", { limit: 5 }],
    queryFn: () => api.getRecentValuations(5),
  });

  const { data: todayStats, isLoading: loadingStats } = useQuery({
    queryKey: ["/api/stats/today"],
    queryFn: api.getTodayStats,
  });

  return (
    <div className="space-y-6">
      {/* Market Trends Chart */}
      <Card className="bg-dark-secondary border-accent-gray/30">
        <CardHeader>
          <h4 className="text-lg font-semibold text-white">Market Trends</h4>
        </CardHeader>
        <CardContent>
          <PriceChart />
          
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-gray">7-day trend</span>
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500">+1.2%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-gray">30-day trend</span>
              <div className="flex items-center">
                <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                <span className="text-red-400">-3.1%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-gray">Market volatility</span>
              <div className="flex items-center">
                <Activity className="h-3 w-3 text-yellow-400 mr-1" />
                <span className="text-yellow-400">Medium</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Valuations */}
      <Card className="bg-dark-secondary border-accent-gray/30">
        <CardHeader>
          <h4 className="text-lg font-semibold text-white">Recent Valuations</h4>
        </CardHeader>
        <CardContent>
          {loadingValuations ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-dark-primary rounded-lg animate-pulse">
                  <div className="w-8 h-8 bg-accent-gray/40 rounded"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-accent-gray/40 rounded w-32"></div>
                    <div className="h-3 bg-accent-gray/40 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-accent-gray/40 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : recentValuations.length > 0 ? (
            <div className="space-y-4">
              {recentValuations.map((valuation) => (
                <div key={valuation.id} className="flex items-center space-x-3 p-3 bg-dark-primary rounded-lg">
                  <Activity className="text-gold h-5 w-5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {valuation.item.name}
                    </p>
                    <p className="text-xs text-text-gray">
                      {new Date(valuation.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gold">
                    ${parseFloat(valuation.recommendedOffer).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-text-gray mx-auto mb-2" />
              <p className="text-text-gray text-sm">No recent valuations</p>
            </div>
          )}

          <button className="w-full mt-4 text-gold hover:text-gold-dark text-sm font-medium transition-colors">
            View All Valuations →
          </button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-dark-secondary border-accent-gray/30">
        <CardHeader>
          <h4 className="text-lg font-semibold text-white">Today's Stats</h4>
        </CardHeader>
        <CardContent>
          {loadingStats ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between animate-pulse">
                  <div className="h-4 bg-accent-gray/40 rounded w-24"></div>
                  <div className="h-6 bg-accent-gray/40 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : todayStats ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-gray text-sm">Items Valued</span>
                <span className="text-xl font-bold text-white">{todayStats.itemsValued}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-gray text-sm">Total Value</span>
                <span className="text-xl font-bold text-gold">{todayStats.totalValue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-gray text-sm">Avg. Margin</span>
                <span className="text-xl font-bold text-green-500">{todayStats.avgMargin}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-text-gray text-sm">Unable to load stats</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
