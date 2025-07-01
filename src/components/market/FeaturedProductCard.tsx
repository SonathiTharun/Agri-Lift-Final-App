
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronRight, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { ProductPreviewDialog } from "./ProductPreviewDialog";
import { useCart } from "@/context/CartContext";

interface FeaturedProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    rating: number;
    image: string;
    discount?: number;
    categoryId: string;
    stock?: number;
    isNew?: boolean;
    isTrending?: boolean;
    viewCount?: number;
  };
}

export const FeaturedProductCard = ({ product }: FeaturedProductCardProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const { formatCurrency } = useCart();
  
  const handleViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreview(true);
  };

  return (
    <>
      <div onClick={handleViewClick} className="cursor-pointer">
        <motion.div 
          whileHover={{ scale: 1.03 }} 
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
        <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="relative h-48 overflow-hidden">
            {product.discount && (
              <Badge className="absolute top-2 right-2 bg-red-500 border-0 z-10 animate-pulse">
                -{product.discount}% OFF
              </Badge>
            )}
            <motion.img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover object-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <CardContent className="py-4 bg-gradient-to-b from-white to-gray-50">
            <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">{product.rating}</span>
            </div>
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-foliage-dark font-bold text-lg">₹{product.price}</span>
              {product.discount && (
                <span className="text-gray-500 line-through text-sm">
                  ₹{Math.round(product.price * (1 + product.discount / 100))}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100">
            <Button 
              variant="outline" 
              className="w-full group hover:bg-foliage hover:text-white border-foliage text-foliage"
              onClick={handleViewClick}
            >
              <span>View Details</span>
              <Eye className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      </div>
      
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
