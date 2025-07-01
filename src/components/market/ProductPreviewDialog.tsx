import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface ProductPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  } | null;
  formatCurrency: (amount: number) => string;
}

export function ProductPreviewDialog({
  open,
  onOpenChange,
  product,
  formatCurrency,
}: ProductPreviewDialogProps) {
  if (!product) return null;

  const finalPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow-md hover:bg-white transition-colors">
          <X className="h-4 w-4" />
        </DialogClose>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Image */}
          <div className="relative h-[250px] md:h-full overflow-hidden bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount && (
              <Badge className="absolute top-4 left-4 bg-red-500 border-0">
                -{product.discount}% OFF
              </Badge>
            )}
          </div>
          
          {/* Product Details */}
          <div className="p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
            </DialogHeader>
            
            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
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
            
            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-foliage-dark font-bold text-2xl">
                {formatCurrency(finalPrice)}
              </span>
              {product.discount && (
                <span className="text-gray-500 line-through text-sm">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            
            {/* Description */}
            <p className="text-gray-600">{product.description}</p>
            
            {/* Stock Status */}
            <div className="pt-2">
              <Badge 
                variant="outline"
                className={`
                  ${product.stock > 10 ? 'bg-green-500/20 text-green-800 border-green-300' : ''}
                  ${product.stock > 0 && product.stock <= 10 ? 'bg-orange-500/20 text-orange-800 border-orange-300' : ''}
                  ${product.stock === 0 ? 'bg-red-500/20 text-red-800 border-red-300' : ''}
                `}
              >
                {product.stock === 0 ? 'Out of Stock' : `${product.stock} left in stock`}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}