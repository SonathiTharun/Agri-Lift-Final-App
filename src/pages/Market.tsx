
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

export default function Market() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  // Get all products for display
  useEffect(() => {
    const allProducts = Object.entries(productsByCategory).flatMap(([categoryId, products]) =>
      products.map(product => ({ ...product, categoryId }))
    );

    let filtered = allProducts;

    // Filter by category
    if (activeFilter !== "all") {
      filtered = filtered.filter(product => product.categoryId === activeFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setDisplayedProducts(filtered.slice(0, 12)); // Show first 12 products
  }, [activeFilter, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filterButtons = [
    { id: "all", label: "All Products" },
    { id: "lab-grown-plants", label: "Plants" },
    { id: "seeds", label: "Seeds" },
    { id: "fertilizers", label: "Fertilizers" },
    { id: "pesticides", label: "Pesticides" },
    { id: "farming-tools", label: "Tools" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />
      
      {/* Weather Widget (Draggable) */}
      <WeatherWidget />
      
      <main className="container mx-auto pt-28 px-4 pb-16">
        {/* Hero Section */}
        <motion.div 
          className="max-w-6xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-foliage/20 to-sky/20 backdrop-blur-sm border border-white/30 font-medium text-sm mb-6">
            ✨ AgriLift Marketplace - Now with AI-Powered Recommendations
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
        
        {/* Modern Filter Bar */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-3 my-12 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GlassCard className="p-2 bg-white/30">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {filterButtons.map((btn) => (
                <motion.button
                  key={btn.id}
                  onClick={() => setActiveFilter(btn.id)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    activeFilter === btn.id 
                      ? 'bg-foliage text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {btn.label}
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Products Grid */}
        {displayedProducts.length > 0 && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <div className="w-1.5 h-8 bg-gradient-to-b from-foliage to-sky rounded-full mr-3"></div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foliage-dark to-sky-dark">
                {searchQuery ? `Search Results for "${searchQuery}"` : 
                 activeFilter === "all" ? "All Products" : 
                 filterButtons.find(b => b.id === activeFilter)?.label}
              </h2>
              <span className="ml-4 text-gray-500">({displayedProducts.length} products)</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ModernProductCard 
                    product={{
                      ...product,
                      isNew: Math.random() > 0.8,
                      isTrending: Math.random() > 0.7,
                      viewCount: Math.floor(Math.random() * 1000) + 50
                    }} 
                  />
                </motion.div>
              ))}
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
    </div>
  );
}
