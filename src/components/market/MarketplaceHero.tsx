import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, Users, Package, Star, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/LanguageContext";
import { GlassCard } from "./GlassCard";

interface MarketStats {
  totalProducts: number;
  activeVendors: number;
  dailyTransactions: number;
  averageRating: number;
}

export const MarketplaceHero = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<MarketStats>({
    totalProducts: 15420,
    activeVendors: 2847,
    dailyTransactions: 1256,
    averageRating: 4.8
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    {
      title: "Smart Agricultural Marketplace",
      subtitle: "Connect with verified vendors and discover premium agricultural products",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=600&fit=crop",
      cta: "Explore Products"
    },
    {
      title: "AI-Powered Crop Recommendations",
      subtitle: "Get personalized suggestions based on your soil and climate data",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=600&fit=crop",
      cta: "Get Recommendations"
    },
    {
      title: "Live Market Analytics",
      subtitle: "Real-time price tracking and market insights for informed decisions",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
      cta: "View Analytics"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animate stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalProducts: prev.totalProducts + Math.floor(Math.random() * 5),
        activeVendors: prev.activeVendors + Math.floor(Math.random() * 3),
        dailyTransactions: prev.dailyTransactions + Math.floor(Math.random() * 10),
        averageRating: Math.min(5, prev.averageRating + (Math.random() - 0.5) * 0.1)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[70vh] overflow-hidden">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col justify-center min-h-[70vh]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
                <Sparkles className="w-3 h-3 mr-1" />
                {t('marketplace.newFeatures')}
              </Badge>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                {heroSlides[currentSlide].title}
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-gray-200 mb-8 leading-relaxed"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                {heroSlides[currentSlide].cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                {t('marketplace.learnMore')}
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Content - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            <GlassCard className="p-6 text-center">
              <Package className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <motion.div
                key={stats.totalProducts}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-white"
              >
                {stats.totalProducts.toLocaleString()}+
              </motion.div>
              <div className="text-gray-300 text-sm">{t('marketplace.products')}</div>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <motion.div
                key={stats.activeVendors}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-white"
              >
                {stats.activeVendors.toLocaleString()}+
              </motion.div>
              <div className="text-gray-300 text-sm">{t('marketplace.vendors')}</div>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <motion.div
                key={stats.dailyTransactions}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-white"
              >
                {stats.dailyTransactions.toLocaleString()}
              </motion.div>
              <div className="text-gray-300 text-sm">{t('marketplace.dailyTransactions')}</div>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <Star className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <motion.div
                key={stats.averageRating}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-white"
              >
                {stats.averageRating.toFixed(1)}
              </motion.div>
              <div className="text-gray-300 text-sm">{t('marketplace.averageRating')}</div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center mt-12 space-x-2"
        >
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};
