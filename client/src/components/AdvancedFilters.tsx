import { useState } from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SearchItemsRequest } from "@shared/schema";

interface AdvancedFiltersProps {
  onFiltersChange?: (filters: SearchItemsRequest) => void;
  onReset?: () => void;
}

export default function AdvancedFilters({ onFiltersChange, onReset }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<SearchItemsRequest>({});

  const handleFilterChange = (key: keyof SearchItemsRequest, value: any) => {
    const newFilters = { ...filters, [key]: value === "all" ? undefined : value || undefined };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    onReset?.();
  };

  return (
    <Card className="bg-dark-secondary border-accent-gray/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Advanced Search & Filters</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleReset}
            className="text-gold hover:text-gold-dark"
          >
            <RotateCcw className="mr-1 h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label className="block text-sm font-medium text-white mb-2">Condition</Label>
            <Select 
              value={filters.condition || ""} 
              onValueChange={(value) => handleFilterChange('condition', value)}
            >
              <SelectTrigger className="w-full bg-dark-primary border-accent-gray/40 text-white focus:border-gold">
                <SelectValue placeholder="All Conditions" />
              </SelectTrigger>
              <SelectContent className="bg-dark-primary border-accent-gray/40">
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="very_good">Very Good</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm font-medium text-white mb-2">Price Range</Label>
            <Select 
              value={filters.minPrice ? `${filters.minPrice}-${filters.maxPrice}` : ""} 
              onValueChange={(value) => {
                if (value === "all") {
                  handleFilterChange('minPrice', undefined);
                  handleFilterChange('maxPrice', undefined);
                } else {
                  const [min, max] = value.split('-').map(Number);
                  handleFilterChange('minPrice', min);
                  handleFilterChange('maxPrice', max);
                }
              }}
            >
              <SelectTrigger className="w-full bg-dark-primary border-accent-gray/40 text-white focus:border-gold">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent className="bg-dark-primary border-accent-gray/40">
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="0-100">Under $100</SelectItem>
                <SelectItem value="100-500">$100 - $500</SelectItem>
                <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                <SelectItem value="5000-999999">$5,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm font-medium text-white mb-2">Age</Label>
            <Select 
              value={filters.age || ""} 
              onValueChange={(value) => handleFilterChange('age', value)}
            >
              <SelectTrigger className="w-full bg-dark-primary border-accent-gray/40 text-white focus:border-gold">
                <SelectValue placeholder="Any Age" />
              </SelectTrigger>
              <SelectContent className="bg-dark-primary border-accent-gray/40">
                <SelectItem value="all">Any Age</SelectItem>
                <SelectItem value="under_1_year">Less than 1 year</SelectItem>
                <SelectItem value="1_3_years">1-3 years</SelectItem>
                <SelectItem value="3_5_years">3-5 years</SelectItem>
                <SelectItem value="5_years_plus">5+ years</SelectItem>
                <SelectItem value="vintage">Vintage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm font-medium text-white mb-2">Brand</Label>
            <Input 
              type="text" 
              placeholder="Enter brand name..." 
              value={filters.brand || ""}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="w-full bg-dark-primary border-accent-gray/40 text-white placeholder-text-gray focus:border-gold" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
