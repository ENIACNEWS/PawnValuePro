import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface ItemEntryProps {
  onItemEntered: (item: any) => void;
}

export function ItemEntry({ onItemEntered }: ItemEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    categoryId: "",
    condition: "",
    description: "",
    age: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: () => api.getCategories(),
  });

  const conditions = [
    { value: "excellent", label: "Excellent" },
    { value: "very_good", label: "Very Good" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
  ];

  const ageOptions = [
    { value: "under_1_year", label: "Under 1 Year" },
    { value: "1_3_years", label: "1-3 Years" },
    { value: "3_5_years", label: "3-5 Years" },
    { value: "5_years_plus", label: "5+ Years" },
    { value: "vintage", label: "Vintage" },
  ];

  const handleSubmit = async () => {
    if (!formData.name || !formData.condition) {
      toast({
        title: "Missing Information",
        description: "Please enter at least the item name and condition.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create new item in database
      const newItem = await api.createItem(formData);
      
      // Trigger valuation for the new item
      onItemEntered(newItem);
      
      // Reset form
      setFormData({
        name: "",
        brand: "",
        model: "",
        categoryId: "",
        condition: "",
        description: "",
        age: "",
      });
      
      setIsOpen(false);
      
      toast({
        title: "Item Added",
        description: `${formData.name} has been added and is being valued.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <Card className="bg-dark-secondary border-accent-gray/30 p-6 cursor-pointer hover:border-gold transition-colors"
            onClick={() => setIsOpen(true)}>
        <div className="flex items-center justify-center gap-3 text-gold">
          <PlusCircle className="w-6 h-6" />
          <span className="font-semibold">Enter New Item for Valuation</span>
        </div>
        <p className="text-gray-400 text-sm text-center mt-2">
          Add item details to get instant pricing analysis
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-dark-secondary border-accent-gray/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-gold" />
          <h3 className="text-lg font-semibold text-white">Enter Item Details</h3>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          Cancel
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-white">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., iPhone 14 Pro"
              className="bg-dark-primary border-accent-gray/50 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="brand" className="text-white">Brand</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="e.g., Apple"
              className="bg-dark-primary border-accent-gray/50 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="model" className="text-white">Model</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="e.g., A2894"
              className="bg-dark-primary border-accent-gray/50 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="category" className="text-white">Category</Label>
            <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
              <SelectTrigger className="bg-dark-primary border-accent-gray/50 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="condition" className="text-white">Condition *</Label>
            <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
              <SelectTrigger className="bg-dark-primary border-accent-gray/50 text-white">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition.value} value={condition.value}>
                    {condition.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="age" className="text-white">Age</Label>
            <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
              <SelectTrigger className="bg-dark-primary border-accent-gray/50 text-white">
                <SelectValue placeholder="Select age" />
              </SelectTrigger>
              <SelectContent>
                {ageOptions.map((age) => (
                  <SelectItem key={age.value} value={age.value}>
                    {age.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-white">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Additional details about the item..."
            className="bg-dark-primary border-accent-gray/50 text-white"
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name || !formData.condition}
            className="bg-gold hover:bg-gold/90 text-dark-primary font-semibold flex-1"
          >
            {isSubmitting ? "Processing..." : "Enter & Value Item"}
          </Button>
        </div>
      </div>
    </Card>
  );
}