import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Star, ShoppingCart, Eye, Brain, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/LanguageContext";
import { GlassCard } from "./GlassCard";

interface RecommendedProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  reason: string;
  confidence: number;
  tags: string[];
  inStock: boolean;
  fastDelivery: boolean;
}

interface RecommendationSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  products: RecommendedProduct[];
  type: 'ai-powered' | 'trending' | 'personalized' | 'seasonal';
}

const mockRecommendations: RecommendationSection[] = [
  {
    title: "AI-Powered Recommendations",
    description: "Based on your soil analysis and farming goals",
    icon: <Brain className="w-5 h-5" />,
    type: "ai-powered",
    products: [
      {
        id: "ai-1",
        name: "Organic NPK Fertilizer - Premium Grade",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
        price: 1299,
        originalPrice: 1599,
        rating: 4.8,
        reviews: 156,
        category: "Fertilizers",
        reason: "Perfect for your soil's nitrogen deficiency",
        confidence: 95,
        tags: ["organic", "nitrogen-rich", "fast-acting"],
        inStock: true,
        fastDelivery: true
      },
      {
        id: "ai-2",
        name: "Smart pH Monitoring Kit",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop",
        price: 2499,
        rating: 4.9,
        reviews: 89,
        category: "Equipment",
        reason: "Recommended for continuous soil monitoring",
        confidence: 88,
        tags: ["smart", "monitoring", "precision"],
        inStock: true,
        fastDelivery: false
      }
    ]
  },
  {
    title: "Trending This Week",
    description: "Popular products among farmers in your region",
    icon: <TrendingUp className="w-5 h-5" />,
    type: "trending",
    products: [
      {
        id: "trend-1",
        name: "Hybrid Tomato Seeds - Disease Resistant",
        image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=300&h=300&fit=crop",
        price: 899,
        rating: 4.7,
        reviews: 234,
        category: "Seeds",
        reason: "High demand in Karnataka region",
        confidence: 92,
        tags: ["hybrid", "disease-resistant", "high-yield"],
        inStock: true,
        fastDelivery: true
      },
      {
        id: "trend-2",
        name: "Bio-Pesticide Spray - Neem Based",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
        price: 649,
        originalPrice: 799,
        rating: 4.6,
        reviews: 178,
        category: "Pesticides",
        reason: "Trending for organic farming",
        confidence: 85,
        tags: ["organic", "neem", "eco-friendly"],
        inStock: true,
        fastDelivery: true
      }
    ]
  },
  {
    title: "Personalized for You",
    description: "Based on your purchase history and preferences",
    icon: <Target className="w-5 h-5" />,
    type: "personalized",
    products: [
      {
        id: "personal-1",
        name: "Drip Irrigation Starter Kit",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop",
        price: 3499,
        rating: 4.8,
        reviews: 145,
        category: "Irrigation",
        reason: "Complements your recent fertilizer purchase",
        confidence: 90,
        tags: ["water-efficient", "easy-install", "durable"],
        inStock: true,
        fastDelivery: false
      }
    ]
  },
  {
    title: "Seasonal Essentials",
    description: "Perfect for the current farming season",
    icon: <Zap className="w-5 h-5" />,
    type: "seasonal",
    products: [
      {
        id: "seasonal-1",
        name: "Monsoon Protection Cover",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
        price: 1899,
        rating: 4.5,
        reviews: 67,
        category: "Protection",
        reason: "Essential for upcoming monsoon season",
        confidence: 87,
        tags: ["waterproof", "durable", "easy-setup"],
        inStock: true,
        fastDelivery: true
      }
    ]
  }
];

export const SmartRecommendations = () => {
  const { t } = useLanguage();
  const [recommendations] = useState(mockRecommendations);
  const [viewedProducts, setViewedProducts] = useState<Set<string>>(new Set());

  const handleProductView = (productId: string) => {
    setViewedProducts(prev => new Set([...prev, productId]));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ai-powered': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'trending': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'personalized': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'seasonal': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const ProductCard = ({ product, sectionType }: { product: RecommendedProduct; sectionType: string }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={() => handleProductView(product.id)}
      className="cursor-pointer"
    >
      <GlassCard className="overflow-hidden h-full hover:bg-white/5 transition-all duration-300">
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.originalPrice && (
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </Badge>
            )}
            {product.fastDelivery && (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Fast Delivery
              </Badge>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(sectionType)}`}>
              {product.confidence}% match
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-white line-clamp-2 flex-1">
              {product.name}
            </h3>
            <Badge variant="outline" className="border-white/20 text-gray-300 text-xs ml-2">
              {product.category}
            </Badge>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white text-sm font-medium">{product.rating}</span>
            </div>
            <span className="text-gray-400 text-sm">({product.reviews} reviews)</span>
          </div>

          <div className="bg-white/5 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">AI Insight</span>
            </div>
            <p className="text-gray-300 text-sm">{product.reason}</p>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-white/20 text-gray-400">
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-green-400">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <div className={`text-sm font-medium ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add to Cart
            </Button>
            <Button size="sm" variant="outline" className="border-white/20 text-gray-300">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );

  const RecommendationSection = ({ section, index }: { section: RecommendationSection; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getTypeColor(section.type)}`}>
            {section.icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{section.title}</h3>
            <p className="text-gray-300 text-sm">{section.description}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="border-white/20 text-gray-300">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {section.products.map((product, productIndex) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: productIndex * 0.1 }}
          >
            <ProductCard product={product} sectionType={section.type} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-12">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            {t('marketplace.smartRecommendations')}
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {t('marketplace.recommendationsDescription')}
          </p>
        </motion.div>
      </div>

      {recommendations.map((section, index) => (
        <RecommendationSection key={section.title} section={section} index={index} />
      ))}

      {/* Recommendation Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <GlassCard className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400 mb-1">95%</div>
              <div className="text-gray-300 text-sm">Recommendation Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400 mb-1">2.3x</div>
              <div className="text-gray-300 text-sm">Higher Purchase Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-1">15min</div>
              <div className="text-gray-300 text-sm">Average Decision Time</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
