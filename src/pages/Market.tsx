
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { WeatherWidget } from "@/components/WeatherWidget";
import { useLanguage } from "@/components/LanguageContext";
import { motion } from "framer-motion";
import LiveMarketTicker from "@/components/crop-allocation/realtime/LiveMarketTicker";
import { categories, featuredProducts } from "@/data/marketData";
import { FeaturedProductsCarousel } from "@/components/market/FeaturedProductsCarousel";
import { FilterBar } from "@/components/market/FilterBar";
import { CategoryCard } from "@/components/market/CategoryCard";
import { TrustSection } from "@/components/market/TrustSection";
import { CallToAction } from "@/components/market/CallToAction";

export default function Market() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const { t } = useLanguage();

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      
      {/* Weather Widget (Draggable) */}
      <WeatherWidget />
      
      <main className="container mx-auto pt-28 px-4 pb-16">
        <motion.div 
          className="max-w-5xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-800 font-medium text-sm mb-4">
            AgriLift Marketplace
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foliage-dark to-sky-dark">
            {t("market-title")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t("market-description")}
          </p>
        </motion.div>
        
        {/* Live Market Ticker */}
        <div className="max-w-5xl mx-auto mb-12">
          <LiveMarketTicker location="National" />
        </div>

        {/* Featured Products Carousel */}
        <FeaturedProductsCarousel featuredProducts={featuredProducts} />
        
        {/* Filter Bar */}
        <FilterBar 
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {/* Product Categories */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-10 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </motion.div>

        {/* Trust Section */}
        <TrustSection />

        {/* Call to Action */}
        <CallToAction />
      </main>
    </div>
  );
}
