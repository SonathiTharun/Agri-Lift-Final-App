
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Star, TrendingUp, Zap, DollarSign, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { GlassCard } from "./GlassCard";

interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  ratings: number[];
  availability: string[];
  features: string[];
  sortBy: string;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
  isOpen: boolean;
  onToggle: () => void;
}

export const AdvancedFilters = ({ onFiltersChange, activeFilters, isOpen, onToggle }: AdvancedFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(activeFilters);

  const categoryOptions = [
    { id: "lab-grown-plants", label: "Lab-Grown Plants", icon: "🌱" },
    { id: "seeds", label: "Seeds", icon: "🌾" },
    { id: "fertilizers", label: "Fertilizers", icon: "🧪" },
    { id: "pesticides", label: "Pesticides", icon: "🛡️" },
    { id: "farming-tools", label: "Tools", icon: "🔧" }
  ];

  const availabilityOptions = [
    { id: "in-stock", label: "In Stock", icon: Package },
    { id: "low-stock", label: "Low Stock", icon: TrendingUp },
    { id: "pre-order", label: "Pre-Order", icon: Calendar }
  ];

  const featureOptions = [
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "new", label: "New Arrivals", icon: Zap },
    { id: "discount", label: "On Sale", icon: DollarSign },
    { id: "high-rated", label: "High Rated", icon: Star }
  ];

  const sortOptions = [
    { id: "relevance", label: "Most Relevant" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "rating", label: "Highest Rated" },
    { id: "newest", label: "Newest First" },
    { id: "popularity", label: "Most Popular" }
  ];

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...localFilters, ...newFilters };
    setLocalFilters(updated);
    onFiltersChange(updated);
  };

  const clearAllFilters = () => {
    const defaultFilters: FilterOptions = {
      priceRange: [0, 10000],
      categories: [],
      ratings: [],
      availability: [],
      features: [],
      sortBy: "relevance"
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const getActiveFilterCount = () => {
    return localFilters.categories.length + 
           localFilters.ratings.length + 
           localFilters.availability.length + 
           localFilters.features.length +
           (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 10000 ? 1 : 0);
  };

  return (
    <>
      <motion.div className="flex items-center gap-3 mb-6">
        <Button
          onClick={onToggle}
          variant="outline"
          className="backdrop-blur-md bg-white/20 border-white/30 hover:bg-white/30"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {getActiveFilterCount() > 0 && (
            <Badge className="ml-2 bg-foliage text-white">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={localFilters.sortBy}
            onChange={(e) => updateFilters({ sortBy: e.target.value })}
            className="px-3 py-1 rounded-lg border border-white/30 backdrop-blur-md bg-white/20 text-sm"
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <GlassCard className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Advanced Filters</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onToggle}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price Range
                </h4>
                <div className="px-3">
                  <Slider
                    value={localFilters.priceRange}
                    onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>₹{localFilters.priceRange[0]}</span>
                    <span>₹{localFilters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="font-medium">Categories</h4>
                <div className="grid grid-cols-2 gap-2">
                  {categoryOptions.map(category => (
                    <label key={category.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/50 transition-colors">
                      <Checkbox
                        checked={localFilters.categories.includes(category.id)}
                        onCheckedChange={(checked) => {
                          const newCategories = checked
                            ? [...localFilters.categories, category.id]
                            : localFilters.categories.filter(c => c !== category.id);
                          updateFilters({ categories: newCategories });
                        }}
                      />
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm">{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-3">
                <h4 className="font-medium">Availability</h4>
                <div className="space-y-2">
                  {availabilityOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <label key={option.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/50 transition-colors">
                        <Checkbox
                          checked={localFilters.availability.includes(option.id)}
                          onCheckedChange={(checked) => {
                            const newAvailability = checked
                              ? [...localFilters.availability, option.id]
                              : localFilters.availability.filter(a => a !== option.id);
                            updateFilters({ availability: newAvailability });
                          }}
                        />
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h4 className="font-medium">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {featureOptions.map(feature => {
                    const Icon = feature.icon;
                    const isSelected = localFilters.features.includes(feature.id);
                    return (
                      <Button
                        key={feature.id}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newFeatures = isSelected
                            ? localFilters.features.filter(f => f !== feature.id)
                            : [...localFilters.features, feature.id];
                          updateFilters({ features: newFeatures });
                        }}
                        className={`${isSelected ? 'bg-foliage hover:bg-foliage-dark' : 'bg-white/20 hover:bg-white/30'}`}
                      >
                        <Icon className="h-3 w-3 mr-1" />
                        {feature.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-3">
                <h4 className="font-medium">Minimum Rating</h4>
                <div className="flex gap-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <Button
                      key={rating}
                      variant={localFilters.ratings.includes(rating) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newRatings = localFilters.ratings.includes(rating)
                          ? localFilters.ratings.filter(r => r !== rating)
                          : [...localFilters.ratings, rating];
                        updateFilters({ ratings: newRatings });
                      }}
                      className={`${localFilters.ratings.includes(rating) ? 'bg-foliage hover:bg-foliage-dark' : 'bg-white/20 hover:bg-white/30'}`}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {rating}+
                    </Button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
