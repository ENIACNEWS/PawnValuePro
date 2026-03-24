import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileText, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { api } from "@/lib/api";
import PriceChart from "@/components/PriceChart";

export default function ItemValuation() {
  const params = useParams();
  const itemId = params.id;

  const { data: item, isLoading: loadingItem } = useQuery({
    queryKey: ["/api/items", itemId],
    queryFn: () => api.getItem(itemId!),
    enabled: !!itemId,
  });

  const { data: valuation, isLoading: loadingValuation } = useQuery({
    queryKey: ["/api/valuations", itemId],
    queryFn: () => api.getValuation(itemId!),
    enabled: !!itemId,
  });

  const { data: priceHistory = [], isLoading: loadingHistory } = useQuery({
    queryKey: ["/api/items", itemId, "price-history"],
    queryFn: () => api.getPriceHistory(itemId!),
    enabled: !!itemId,
  });

  if (loadingItem || loadingValuation) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="h-8 bg-accent-gray/40 rounded w-64 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-dark-secondary border-accent-gray/30 animate-pulse">
              <CardContent className="p-6">
                <div className="h-40 bg-accent-gray/40 rounded"></div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="bg-dark-secondary border-accent-gray/30 animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-accent-gray/40 rounded"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="bg-dark-secondary border-accent-gray/30">
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-text-gray mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Item Not Found</h2>
            <p className="text-text-gray">The requested item could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent': return 'bg-green-500/20 text-green-400';
      case 'very_good': return 'bg-blue-500/20 text-blue-400';
      case 'good': return 'bg-gold/20 text-gold';
      case 'fair': return 'bg-orange-500/20 text-orange-400';
      case 'poor': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gold/20 text-gold';
    }
  };

  const formatCondition = (condition: string) => {
    return condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">{item.name}</h1>
        </div>
        
        <div className="flex space-x-3">
          <Button className="gradient-gold hover:opacity-90">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline" className="border-accent-gray hover:border-gold text-white hover:text-gold">
            <History className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Item Details */}
          <Card className="bg-dark-secondary border-accent-gray/30">
            <CardHeader>
              <h3 className="text-xl font-semibold text-white">Item Details</h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-6">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-accent-gray/40 rounded-lg flex items-center justify-center">
                    <FileText className="h-16 w-16 text-text-gray" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{item.name}</h2>
                  {item.description && (
                    <p className="text-text-gray mb-4">{item.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-text-gray">Brand</label>
                      <p className="text-white font-medium">{item.brand || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-text-gray">Model</label>
                      <p className="text-white font-medium">{item.model || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-text-gray">Condition</label>
                      <Badge className={getConditionColor(item.condition)}>
                        {formatCondition(item.condition)}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm text-text-gray">SKU</label>
                      <p className="text-white font-medium">{item.sku || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Valuation Results */}
          {valuation ? (
            <Card className="bg-dark-secondary border-accent-gray/30">
              <CardHeader>
                <h3 className="text-xl font-semibold text-white">Current Valuation</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-text-gray text-sm mb-1">Market Value</p>
                    <p className="text-3xl font-bold text-white">
                      ${parseFloat(valuation.marketValue).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-text-gray text-sm mb-1">Recommended Offer</p>
                    <p className="text-3xl font-bold text-gold">
                      ${parseFloat(valuation.recommendedOffer).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-text-gray text-sm mb-1">Profit Margin</p>
                    <p className="text-3xl font-bold text-green-500">
                      ${parseFloat(valuation.profitMargin).toLocaleString()}
                    </p>
                    <p className="text-sm text-text-gray">
                      {parseFloat(valuation.marginPercentage).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="border-t border-accent-gray/30 pt-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Data Sources</h4>
                  <div className="space-y-3">
                    {valuation.dataSources && JSON.parse(valuation.dataSources as any).map((source: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-dark-primary rounded-lg">
                        <span className="text-white">{source.source}</span>
                        <div className="text-right">
                          <p className="text-gold font-medium">${source.price?.toLocaleString()}</p>
                          <p className="text-xs text-text-gray">{source.confidence}% confidence</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-dark-secondary border-accent-gray/30">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-text-gray mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Valuation Available</h3>
                <p className="text-text-gray mb-4">This item has not been valuated yet.</p>
                <Button className="gradient-gold hover:opacity-90">
                  Start Valuation
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price History Chart */}
          <Card className="bg-dark-secondary border-accent-gray/30">
            <CardHeader>
              <h4 className="text-lg font-semibold text-white">Price History</h4>
            </CardHeader>
            <CardContent>
              <PriceChart />
              {priceHistory.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {priceHistory.slice(0, 5).map((history) => (
                    <div key={history.id} className="flex items-center justify-between text-sm">
                      <span className="text-text-gray">{history.source}</span>
                      <span className="text-white">${parseFloat(history.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-gray text-sm mt-4">No price history available</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-dark-secondary border-accent-gray/30">
            <CardHeader>
              <h4 className="text-lg font-semibold text-white">Quick Actions</h4>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gradient-gold hover:opacity-90">
                <FileText className="mr-2 h-4 w-4" />
                Generate PDF Report
              </Button>
              <Button variant="outline" className="w-full border-accent-gray hover:border-gold text-white hover:text-gold">
                <History className="mr-2 h-4 w-4" />
                Update Valuation
              </Button>
              <Button variant="outline" className="w-full border-accent-gray hover:border-gold text-white hover:text-gold">
                Share Valuation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
