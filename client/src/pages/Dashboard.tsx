import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import QuickSearch from "@/components/QuickSearch";
import { QuickScan } from "@/components/QuickScan";
import { AIAssistant } from "@/components/AIAssistant";
import { ItemEntry } from "@/components/ItemEntry";
import CategoryGrid from "@/components/CategoryGrid";
import ValuationResults from "@/components/ValuationResults";
import MarketTrends from "@/components/MarketTrends";
import AdvancedFilters from "@/components/AdvancedFilters";
import { api } from "@/lib/api";
import type { Item, SearchItemsRequest } from "@shared/schema";
import type { SearchSuggestion, ValuationResult } from "../types";

export default function Dashboard() {
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [currentValuation, setCurrentValuation] = useState<ValuationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchItemsRequest>({});

  const { data: searchResults = [] } = useQuery({
    queryKey: ["/api/items/search", searchFilters],
    queryFn: () => api.searchItems(searchFilters),
    enabled: Object.keys(searchFilters).length > 0,
  });

  const handleItemSelect = async (suggestion: SearchSuggestion) => {
    try {
      const item = await api.getItem(suggestion.id);
      setSelectedItem(item);
      
      // Perform pricing analysis
      setIsAnalyzing(true);
      const valuation = await api.analyzePricing({
        itemName: item.name,
        brand: item.brand || undefined,
        model: item.model || undefined,
        condition: item.condition,
      });
      
      setCurrentValuation(valuation);
      
      toast({
        title: "Valuation Complete",
        description: `Analyzed pricing for ${item.name}`,
      });
    } catch (error) {
      console.error('Error analyzing item:', error);
      toast({
        title: "Analysis Error",
        description: "Unable to analyze pricing for this item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSearchFilters({ ...searchFilters, categoryId });
  };

  const handleFiltersChange = (filters: SearchItemsRequest) => {
    setSearchFilters(filters);
  };

  const handleResetFilters = () => {
    setSearchFilters({});
  };

  const handleBarcodeScan = async (barcode: string) => {
    try {
      // Search for item by barcode
      const results = await api.searchItems({ query: barcode });
      if (results.length > 0) {
        await handleItemSelect({ 
          id: results[0].id, 
          name: results[0].name, 
          brand: results[0].brand || undefined, 
          model: results[0].model || undefined, 
          categoryId: results[0].categoryId || undefined 
        });
      } else {
        toast({
          title: "Item Not Found",
          description: `No item found with barcode: ${barcode}. Try searching manually.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Scan Error",
        description: "Failed to process barcode scan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleQuickScan = () => {
    toast({
      title: "Quick Scan",
      description: "Use the Quick Scan panel below to scan barcodes!",
    });
  };

  const handleGenerateReport = () => {
    if (!selectedItem || !currentValuation) return;
    
    toast({
      title: "Generating Report",
      description: "Professional valuation report is being prepared...",
    });
    
    // TODO: Implement PDF report generation
    console.log('Generating report for:', selectedItem.name);
  };

  const handleViewHistory = () => {
    if (!selectedItem) return;
    
    toast({
      title: "Price History",
      description: "Loading historical pricing data...",
    });
    
    // TODO: Navigate to price history view
    console.log('Viewing price history for:', selectedItem.name);
  };

  const handleItemEntered = async (newItem: Item) => {
    try {
      setSelectedItem(newItem);
      
      // Perform pricing analysis for the new item
      setIsAnalyzing(true);
      const valuation = await api.analyzePricing({
        itemName: newItem.name,
        brand: newItem.brand || undefined,
        model: newItem.model || undefined,
        condition: newItem.condition,
      });
      
      setCurrentValuation(valuation);
      
      toast({
        title: "Item Valued",
        description: `${newItem.name} has been analyzed and valued.`,
      });
    } catch (error) {
      toast({
        title: "Valuation Error",
        description: "Failed to analyze the new item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <QuickSearch 
        onItemSelect={handleItemSelect}
        onQuickScan={handleQuickScan}
      />

      <CategoryGrid onCategorySelect={handleCategorySelect} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <ValuationResults
          item={selectedItem || undefined}
          valuation={currentValuation || undefined}
          isLoading={isAnalyzing}
          onGenerateReport={handleGenerateReport}
          onViewHistory={handleViewHistory}
        />

        <QuickScan onItemScanned={handleBarcodeScan} />

        <ItemEntry onItemEntered={handleItemEntered} />
      </div>

      <MarketTrends categoryId={searchFilters.categoryId} />

      <AdvancedFilters 
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-6">Search Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemSelect({ id: item.id, name: item.name, brand: item.brand || undefined, model: item.model || undefined, categoryId: item.categoryId || undefined })}
                className="bg-dark-secondary border border-accent-gray/30 rounded-lg p-4 cursor-pointer hover:border-gold transition-colors"
              >
                <h4 className="text-white font-medium">{item.name}</h4>
                {item.brand && (
                  <p className="text-text-gray text-sm">by {item.brand}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded">
                    {item.condition.replace('_', ' ')}
                  </span>
                  {item.sku && (
                    <span className="text-xs text-text-gray">{item.sku}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Assistant - Floating Component */}
      <AIAssistant 
        selectedItem={selectedItem}
        currentValuation={currentValuation}
      />
    </div>
  );
}
