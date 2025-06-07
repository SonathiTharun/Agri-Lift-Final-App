
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye, 
  TrendingUp, 
  Zap,
  Users,
  Clock
} from "lucide-react";
import { GlassCard } from "./GlassCard";

interface ModernProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    rating: number;
    image: string;
    discount?: number;
    categoryId: string;
    stock: number;
    isNew?: boolean;
    isTrending?: boolean;
    viewCount?: number;
  };
}

export const ModernProductCard = ({ product }: ModernProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const finalPrice = product.discount 
    ? Math.round(product.price * (1 - product.discount / 100)) 
    : product.price;

  const stockStatus = product.stock > 10 ? 'high' : product.stock > 0 ? 'low' : 'out';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <GlassCard className="h-full overflow-hidden bg-white/90 backdrop-blur-sm">
        <div className="relative h-56 overflow-hidden">
          {/* Image */}
          <motion.div
            className="relative h-full w-full"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src={product.image} 
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
            )}
          </motion.div>

          {/* Overlay with quick actions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center gap-2"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Quick View
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.discount && (
              <Badge className="bg-red-500 border-0 animate-pulse">
                -{product.discount}% OFF
              </Badge>
            )}
            {product.isNew && (
              <Badge className="bg-green-500 border-0">
                <Zap className="h-3 w-3 mr-1" />
                New
              </Badge>
            )}
            {product.isTrending && (
              <Badge className="bg-orange-500 border-0">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>

          {/* Wishlist button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
          >
            <Heart 
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-600'
              }`} 
            />
          </motion.button>

          {/* Stock indicator */}
          <div className="absolute bottom-3 right-3">
            <Badge 
              variant="outline"
              className={`
                ${stockStatus === 'high' ? 'bg-green-500/20 text-green-800 border-green-300' : ''}
                ${stockStatus === 'low' ? 'bg-orange-500/20 text-orange-800 border-orange-300' : ''}
                ${stockStatus === 'out' ? 'bg-red-500/20 text-red-800 border-red-300' : ''}
              `}
            >
              {stockStatus === 'out' ? 'Out of Stock' : `${product.stock} left`}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Product name */}
          <Link to={`/market/${product.categoryId}/${product.id}`}>
            <h3 className="font-semibold text-lg text-gray-800 hover:text-foliage transition-colors line-clamp-2 group-hover:text-foliage">
              {product.name}
            </h3>
          </Link>

          {/* Rating and views */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.floor(product.rating) 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
            </div>
            
            {product.viewCount && (
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-3 w-3 mr-1" />
                {product.viewCount}
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-foliage-dark font-bold text-xl">₹{finalPrice}</span>
              {product.discount && (
                <span className="text-gray-500 line-through text-sm">
                  ₹{product.price}
                </span>
              )}
            </div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to={`/market/${product.categoryId}/${product.id}`}>
                <Button 
                  size="sm" 
                  className="bg-foliage hover:bg-foliage-dark transition-colors"
                  disabled={stockStatus === 'out'}
                >
                  {stockStatus === 'out' ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Recently viewed indicator */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }}
            className="flex items-center text-xs text-gray-500 overflow-hidden"
          >
            <Clock className="h-3 w-3 mr-1" />
            Last viewed 2 hours ago
          </motion.div>
        </CardContent>
      </GlassCard>
    </motion.div>
  );
};
