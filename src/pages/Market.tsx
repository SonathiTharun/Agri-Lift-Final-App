import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { WeatherWidget } from "@/components/WeatherWidget";
import { useLanguage } from "@/components/LanguageContext";
import { motion } from "framer-motion";
import { categories, featuredProducts, productsByCategory } from "@/data/marketData";
import { FeaturedProductsCarousel } from "@/components/market/FeaturedProductsCarousel";
import { CategoryCard } from "@/components/market/CategoryCard";
import { TrustSection } from "@/components/market/TrustSection";
import { CallToAction } from "@/components/market/CallToAction";
import { ModernSearch } from "@/components/market/ModernSearch";
import { RealTimePriceTicker } from "@/components/market/RealTimePriceTicker";
import { ModernProductCard } from "@/components/market/ModernProductCard";
import { GlassCard } from "@/components/market/GlassCard";
import { AdvancedFilters } from "@/components/market/AdvancedFilters";
import { ProductComparison } from "@/components/market/ProductComparison";
import { NotificationCenter } from "@/components/market/NotificationCenter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Compare, Moon, Sun, Grid, List, Zap, TrendingUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { toast } from 'sonner';

interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  ratings: number[];
  availability: string[];
  features: string[];
  sortBy: string;
}

export default function Market() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [compareProducts, setCompareProducts] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    categories: [],
    ratings: [],
    availability: [],
    features: [],
    sortBy: "relevance"
  });

  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { wishlist } = useWishlist();
  const { marketData, isLoading: isRealTimeLoading } = useRealTimeData("global");

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  // Get all products for display with enhanced filtering
  useEffect(() => {
    const allProducts = Object.entries(productsByCategory).flatMap(([categoryId, products]) =>
      products.map(product => ({ 
        ...product, 
        categoryId,
        isNew: Math.random() > 0.8,
        isTrending: Math.random() > 0.7,
        viewCount: Math.floor(Math.random() * 1000) + 50,
        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : undefined
      }))
    );

    let filtered = allProducts;

    // Apply filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => filters.categories.includes(product.categoryId));
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) {
      filtered = filtered.filter(product => {
        const price = product.discount 
          ? product.price * (1 - product.discount / 100)
          : product.price;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    if (filters.ratings.length > 0) {
      const minRating = Math.min(...filters.ratings);
      filtered = filtered.filter(product => product.rating >= minRating);
    }

    if (filters.features.length > 0) {
      filtered = filtered.filter(product => {
        return filters.features.some(feature => {
          switch (feature) {
            case 'trending': return product.isTrending;
            case 'new': return product.isNew;
            case 'discount': return product.discount;
            case 'high-rated': return product.rating >= 4.5;
            default: return false;
          }
        });
      });
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popularity':
        filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
    }

    setDisplayedProducts(filtered.slice(0, 24));
  }, [filters, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const addToComparison = (product: any) => {
    if (compareProducts.length >= 3) {
      toast.error('You can compare up to 3 products only');
      return;
    }
    
    if (compareProducts.find(p => p.id === product.id)) {
      toast.error('Product already in comparison');
      return;
    }

    setCompareProducts(prev => [...prev, product]);
    toast.success(`${product.name} added to comparison`);
  };

  const removeFromComparison = (productId: string) => {
    setCompareProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearComparison = () => {
    setCompareProducts([]);
    setShowComparison(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-green-50 via-blue-50 to-purple-50'
    }`}>
      <Navbar />
      
      {/* Weather Widget (Draggable) */}
      <WeatherWidget />
      
      <main className="container mx-auto pt-28 px-4 pb-16">
        {/* Enhanced Header */}
        <motion.div 
          className="max-w-6xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-foliage/20 to-sky/20 backdrop-blur-sm border border-white/30 font-medium text-sm">
              ✨ AgriLift Marketplace - Now with AI-Powered Recommendations
            </div>
            
            <div className="flex items-center gap-3">
              <NotificationCenter />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foliage-dark via-sky-dark to-purple-600">
            {t("market-title")}
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed">
            {t("market-description")}
          </p>
        </motion.div>

        {/* Modern Search */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ModernSearch onSearch={handleSearch} />
        </motion.div>
        
        {/* Real-time Price Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <RealTimePriceTicker />
        </motion.div>

        {/* Featured Products Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FeaturedProductsCarousel featuredProducts={featuredProducts} />
        </motion.div>
        
        {/* Advanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AdvancedFilters
            onFiltersChange={handleFiltersChange}
            activeFilters={filters}
            isOpen={isFiltersOpen}
            onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
          />
        </motion.div>

        {/* Comparison Bar */}
        {compareProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Compare className="h-5 w-5" />
                    <span className="font-medium">Compare Products</span>
                    <Badge>{compareProducts.length}/3</Badge>
                  </div>
                  <div className="flex gap-2">
                    {compareProducts.map(product => (
                      <div key={product.id} className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                        <span className="text-sm">{product.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromComparison(product.id)}
                          className="h-4 w-4 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowComparison(true)}
                    disabled={compareProducts.length < 2}
                    className="bg-foliage hover:bg-foliage-dark"
                  >
                    Compare Now
                  </Button>
                  <Button variant="ghost" onClick={clearComparison}>
                    Clear
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Products Section */}
        {displayedProducts.length > 0 && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-1.5 h-8 bg-gradient-to-b from-foliage to-sky rounded-full mr-3"></div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foliage-dark to-sky-dark">
                  {searchQuery ? `Search Results for "${searchQuery}"` : "Products"}
                </h2>
                <span className="ml-4 text-gray-500">({displayedProducts.length} products)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-foliage text-white' : ''}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-foliage text-white' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ModernProductCard 
                    product={product}
                    onAddToComparison={() => addToComparison(product)}
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <Button 
                size="lg" 
                variant="outline"
                className="backdrop-blur-md bg-white/20 border-white/30 hover:bg-white/30"
              >
                Load More Products
              </Button>
            </div>
          </motion.div>
        )}

        {/* Product Categories */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-16 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="md:col-span-2 lg:col-span-3 mb-6">
            <div className="flex items-center">
              <div className="w-1.5 h-8 bg-gradient-to-b from-foliage to-sky rounded-full mr-3"></div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foliage-dark to-sky-dark">
                Shop by Category
              </h2>
            </div>
          </div>
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <TrustSection />
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <CallToAction />
        </motion.div>
      </main>

      {/* Product Comparison Modal */}
      {showComparison && compareProducts.length >= 2 && (
        <ProductComparison
          products={compareProducts}
          onClose={() => setShowComparison(false)}
          onRemoveProduct={removeFromComparison}
        />
      )}
    </div>
  );
}
