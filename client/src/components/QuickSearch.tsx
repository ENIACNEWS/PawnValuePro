import { useState, useEffect } from "react";
import { Search, Barcode, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import type { SearchSuggestion } from "../types";

interface QuickSearchProps {
  onItemSelect?: (suggestion: SearchSuggestion) => void;
  onQuickScan?: () => void;
}

export default function QuickSearch({ onItemSelect, onQuickScan }: QuickSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: suggestions = [] } = useQuery({
    queryKey: ["/api/items/suggestions", debouncedQuery],
    queryFn: () => api.getSearchSuggestions(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  useEffect(() => {
    setShowSuggestions(debouncedQuery.length >= 2 && suggestions.length > 0);
  }, [debouncedQuery, suggestions]);

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    onItemSelect?.(suggestion);
  };

  return (
    <div className="mb-8">
      <div className="bg-dark-secondary rounded-xl p-6 border border-accent-gray/30">
        <h2 className="text-2xl font-semibold text-white mb-6">Quick Item Valuation</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by item name, brand, model, or scan barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-primary border border-accent-gray/40 rounded-lg px-4 py-3 pl-12 text-white placeholder-text-gray focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-gray h-4 w-4" />
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-gold/20 hover:bg-gold/30 rounded-md transition-colors"
              >
                <Barcode className="text-gold h-4 w-4" />
              </Button>
            </div>
            
            {/* Search Suggestions */}
            {showSuggestions && (
              <div className="mt-2 bg-dark-primary border border-accent-gray/40 rounded-lg shadow-lg animate-slide-up">
                <div className="p-2 space-y-1">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-2 hover:bg-accent-gray/20 rounded cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Search className="text-gold h-4 w-4" />
                        <div>
                          <span className="text-white">{suggestion.name}</span>
                          {suggestion.brand && (
                            <span className="text-text-gray ml-2">by {suggestion.brand}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Scan Button */}
          <div className="flex items-end">
            <Button 
              onClick={onQuickScan}
              className="w-full gradient-gold hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Camera className="h-4 w-4" />
              <span>Quick Scan</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
