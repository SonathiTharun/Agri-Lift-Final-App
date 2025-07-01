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
  Clock,
  SplitSquareVertical, // Replacing Compare with SplitSquareVertical
  Share,
  Plus,
  Minus
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/context/CartContext";
import { toast } from 'sonner';
import { ProductPreviewDialog } from "./ProductPreviewDialog";


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
  onAddToComparison?: () => void;
  viewMode?: 'grid' | 'list';
}

export const ModernProductCard = ({ product, onAddToComparison, viewMode = 'grid' }: ModernProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart, formatCurrency } = useCart();

  const finalPrice = product.discount 
    ? Math.round(product.price * (1 - product.discount / 100)) 
    : product.price;

  const stockStatus = product.stock > 10 ? 'high' : product.stock > 0 ? 'low' : 'out';
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: finalPrice,
        image: product.image,
        categoryId: product.categoryId
      });
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (stockStatus === 'out' || isAdding) return;

    setIsAdding(true);

    try {
      addToCart(
        product.id,
        product.name,
        finalPrice,
        product.image,
        product.categoryId,
        quantity
      );
      toast.success(`${quantity}x ${product.name} added to cart!`);

      // Reset quantity to 1 after adding
      setQuantity(1);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      // Reset the adding state after a short delay
      setTimeout(() => setIsAdding(false), 1000);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href + `/${product.categoryId}/${product.id}`
      });
    } else {
      navigator.clipboard.writeText(
        window.location.href + `/${product.categoryId}/${product.id}`
      );
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToComparison?.();
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreview(true);
  };

  // Store the JSX for the list view card
  const listViewCard = (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 5 }}
      className="group"
    >
      <div onClick={handleViewClick} className="cursor-pointer">
        <GlassCard className="overflow-hidden bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-all duration-300">
          <div className="flex gap-4 p-4">
            {/* Image */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover rounded-lg cursor-pointer"
                onLoad={() => setImageLoaded(true)}
                onClick={handleViewClick}
              />
              {/* Status badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.discount && (
                  <Badge className="bg-red-500 border-0 text-xs">
                    -{product.discount}%
                  </Badge>
                )}
                {product.isNew && (
                  <Badge className="bg-green-500 border-0 text-xs">
                    <Zap className="h-2 w-2 mr-1" />
                    New
                  </Badge>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 group-hover:text-foliage transition-colors line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-2 mt-2">
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
                  <span className="text-sm text-gray-600">({product.rating})</span>
                  {product.viewCount && (
                    <div className="flex items-center text-sm text-gray-500 ml-auto">
                      <Users className="h-3 w-3 mr-1" />
                      {product.viewCount}
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-foliage-dark font-bold text-xl">{formatCurrency(finalPrice)}</span>
                  {product.discount && (
                    <span className="text-gray-500 line-through text-sm">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleWishlistToggle}
                      className="p-2"
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-600'
                        }`}
                      />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCompare}
                      className="p-2"
                    >
                      <SplitSquareVertical className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleViewClick}
                      className="p-2"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setQuantity(Math.max(1, quantity - 1));
                        }}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setQuantity(Math.min(product.stock, quantity + 1));
                        }}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      className={`transition-colors ${
                        isAdding
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-foliage hover:bg-foliage-dark'
                      }`}
                      disabled={stockStatus === 'out' || isAdding}
                      onClick={handleAddToCart}
                    >
                      {stockStatus === 'out'
                        ? 'Out of Stock'
                        : isAdding
                          ? 'Added!'
                          : 'Add to Cart'
                      }
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );

  // Store the JSX for the grid view card
  const gridViewCard = (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <GlassCard className="h-full overflow-hidden bg-white/90 backdrop-blur-sm cursor-pointer" onClick={handleViewClick}>
        <div className="relative h-56 overflow-hidden">
          {/* Image */}
          <motion.div
            className="relative h-full w-full"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <img 
                src={product.image} 
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-500 cursor-pointer ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onClick={handleViewClick}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
              )}
            </div>
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
                  onClick={handleCompare}
                >
                  <SplitSquareVertical className="h-4 w-4 mr-1" />
                  Compare
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white"
                  onClick={handleViewClick}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
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

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
            >
              <Heart 
                className={`h-4 w-4 transition-colors ${
                  isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-600'
                }`} 
              />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
            >
              <Share className="h-4 w-4 text-gray-600" />
            </motion.button>
          </div>

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
          <div onClick={handleViewClick} className="cursor-pointer">
            <h3 className="font-semibold text-lg text-gray-800 hover:text-foliage transition-colors line-clamp-2 group-hover:text-foliage">
              {product.name}
            </h3>
          </div>

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

          {/* Price and Cart Controls */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-foliage-dark font-bold text-xl">{formatCurrency(finalPrice)}</span>
              {product.discount && (
                <span className="text-gray-500 line-through text-sm">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setQuantity(Math.min(product.stock, quantity + 1));
                  }}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                <Button
                  size="sm"
                  className={`w-full transition-colors ${
                    isAdding
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-foliage hover:bg-foliage-dark'
                  }`}
                  disabled={stockStatus === 'out' || isAdding}
                  onClick={handleAddToCart}
                >
                  {stockStatus === 'out'
                    ? 'Out of Stock'
                    : isAdding
                      ? 'Added!'
                      : 'Add to Cart'
                  }
                </Button>
              </motion.div>
            </div>
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

  return (
    <>
      {/* Product Card */}
      {viewMode === 'list' ? listViewCard : gridViewCard}
      
      {/* Product Preview Dialog */}
      <ProductPreviewDialog 
        open={showPreview} 
        onOpenChange={setShowPreview} 
        product={product}
        formatCurrency={formatCurrency}
      />
    </>
  );
};
