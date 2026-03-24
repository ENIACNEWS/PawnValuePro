import { useState } from "react";
import { FileText, History, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ValuationResult } from "../types";
import type { Item } from "@shared/schema";

interface ValuationResultsProps {
  item?: Item;
  valuation?: ValuationResult;
  isLoading?: boolean;
  onGenerateReport?: () => void;
  onViewHistory?: () => void;
}

export default function ValuationResults({ 
  item, 
  valuation, 
  isLoading, 
  onGenerateReport, 
  onViewHistory 
}: ValuationResultsProps) {
  if (isLoading) {
    return (
      <div className="lg:col-span-2">
        <Card className="bg-dark-secondary border-accent-gray/30 animate-pulse">
          <CardHeader className="border-b border-accent-gray/30">
            <div className="h-6 bg-accent-gray/40 rounded w-48"></div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-24 h-20 bg-accent-gray/40 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-accent-gray/40 rounded w-64"></div>
                  <div className="h-4 bg-accent-gray/40 rounded w-80"></div>
                  <div className="h-4 bg-accent-gray/40 rounded w-32"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="text-center space-y-2">
                    <div className="h-4 bg-accent-gray/40 rounded w-24 mx-auto"></div>
                    <div className="h-8 bg-accent-gray/40 rounded w-20 mx-auto"></div>
                    <div className="h-3 bg-accent-gray/40 rounded w-16 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!item || !valuation) {
    return (
      <div className="lg:col-span-2">
        <Card className="bg-dark-secondary border-accent-gray/30">
          <CardContent className="p-12 text-center">
            <div className="text-text-gray">
              <FileText className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Item Selected</h3>
              <p className="text-sm">Search for an item or select a category to get started with valuation.</p>
            </div>
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
    <div className="lg:col-span-2">
      <Card className="bg-dark-secondary border-accent-gray/30 overflow-hidden">
        <CardHeader className="border-b border-accent-gray/30">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Current Valuation</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-gray">Last updated:</span>
              <span className="text-sm text-gold">2 mins ago</span>
            </div>
          </div>
        </CardHeader>

        {/* Item Details */}
        <CardContent className="p-6 border-b border-accent-gray/30">
          <div className="flex items-start space-x-4">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.name}
                className="w-24 h-20 rounded-lg object-cover"
              />
            ) : (
              <div className="w-24 h-20 bg-accent-gray/40 rounded-lg flex items-center justify-center">
                <FileText className="h-8 w-8 text-text-gray" />
              </div>
            )}
            
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-white">{item.name}</h4>
              {item.description && (
                <p className="text-text-gray text-sm mt-1">{item.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-2">
                <Badge className={getConditionColor(item.condition)}>
                  {formatCondition(item.condition)}
                </Badge>
                {item.sku && (
                  <span className="text-sm text-text-gray">
                    SKU: <span className="text-white">{item.sku}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        {/* Price Analysis */}
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <p className="text-text-gray text-sm mb-1">Market Average</p>
              <p className="text-2xl font-bold text-white">
                ${valuation.marketValue.toLocaleString()}
              </p>
              <div className="flex items-center justify-center mt-1">
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                <p className="text-green-500 text-sm">+2.3% vs last week</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-text-gray text-sm mb-1">Recommended Offer</p>
              <p className="text-3xl font-bold text-gold">
                ${valuation.recommendedOffer.toLocaleString()}
              </p>
              <p className="text-text-gray text-sm">
                {Math.round((valuation.recommendedOffer / valuation.marketValue) * 100)}% of market value
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-text-gray text-sm mb-1">Profit Margin</p>
              <p className="text-2xl font-bold text-green-500">
                ${valuation.profitMargin.toLocaleString()}
              </p>
              <p className="text-text-gray text-sm">
                {valuation.marginPercentage.toFixed(1)}% expected profit
              </p>
            </div>
          </div>

          {/* Price Sources */}
          <div className="mb-6">
            <h5 className="text-sm font-medium text-white mb-3">Data Sources</h5>
            <div className="space-y-2">
              {valuation.dataSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-dark-primary rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-sm text-white">{source.source}</span>
                  </div>
                  <span className="text-sm text-gold font-medium">
                    ${source.price.toLocaleString()} avg
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button 
              onClick={onGenerateReport}
              className="flex-1 gradient-gold hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button 
              onClick={onViewHistory}
              variant="outline" 
              className="border-accent-gray hover:border-gold text-white hover:text-gold transition-colors rounded-lg px-6"
            >
              <History className="mr-2 h-4 w-4" />
              Price History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
