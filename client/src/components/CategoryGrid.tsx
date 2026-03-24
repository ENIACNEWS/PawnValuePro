import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Gem, Laptop, Car, Guitar, Hammer, Target, Coins, CircleDot, Palette, ShoppingBag, Home, Camera, Leaf, Zap, Landmark } from "lucide-react";

const categoryIcons: Record<string, any> = {
  "Jewelry & Watches": Gem,
  "Electronics": Laptop,
  "Vehicles": Car,
  "Musical Instruments": Guitar,
  "Tools & Equipment": Hammer,
  "Firearms": Target,
  "Collectibles & Coins": Coins,
  "Sporting Goods": CircleDot,
  "Art & Antiques": Palette,
  "Designer Items": ShoppingBag,
  "Home Appliances": Home,
  "Cameras & Photography": Camera,
  "Lawn & Garden": Leaf,
  "Power Equipment": Zap,
  "Precious Metals": Landmark,
};

interface CategoryGridProps {
  onCategorySelect?: (categoryId: string) => void;
}

export default function CategoryGrid({ onCategorySelect }: CategoryGridProps) {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: api.getCategories,
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">Item Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <Card key={i} className="bg-dark-secondary border-accent-gray/30 p-4 animate-pulse">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-gray/40 rounded-full mx-auto mb-3"></div>
                <div className="h-4 bg-accent-gray/40 rounded mb-1"></div>
                <div className="h-3 bg-accent-gray/40 rounded w-16 mx-auto"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-white mb-6">Item Categories</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category) => {
          const IconComponent = categoryIcons[category.name] || Gem;
          return (
            <Card
              key={category.id}
              onClick={() => onCategorySelect?.(category.id)}
              className="bg-dark-secondary hover:bg-accent-gray/20 border border-accent-gray/30 rounded-lg p-4 cursor-pointer transition-all hover:scale-105 group"
            >
              <div className="text-center">
                <IconComponent className="text-3xl text-gold mb-3 group-hover:animate-pulse-gold mx-auto h-8 w-8" />
                <h4 className="font-medium text-sm text-white">{category.name}</h4>
                <p className="text-xs text-text-gray mt-1">
                  {category.itemCount?.toLocaleString() || 0} items
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
