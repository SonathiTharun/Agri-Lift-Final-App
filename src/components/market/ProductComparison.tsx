
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Check, Minus, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "./GlassCard";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  specifications?: Record<string, string>;
  features?: string[];
  discount?: number;
}

interface ProductComparisonProps {
  products: Product[];
  onClose: () => void;
  onRemoveProduct: (id: string) => void;
}

export const ProductComparison = ({ products, onClose, onRemoveProduct }: ProductComparisonProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = window.innerWidth < 768;
  const displayedProducts = isMobile ? [products[currentIndex]] : products.slice(0, 3);

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const allSpecs = Array.from(
    new Set(
      products.flatMap(product => Object.keys(product.specifications || {}))
    )
  );

  const allFeatures = Array.from(
    new Set(
      products.flatMap(product => product.features || [])
    )
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-6xl max-h-[90vh] overflow-auto"
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Product Comparison</h2>
            <div className="flex items-center gap-2">
              {isMobile && products.length > 1 && (
                <>
                  <Button variant="ghost" size="sm" onClick={prevProduct}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    {currentIndex + 1} of {products.length}
                  </span>
                  <Button variant="ghost" size="sm" onClick={nextProduct}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Product Header */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveProduct(product.id)}
                    className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  
                  {product.discount && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      -{product.discount}% OFF
                    </Badge>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                  
                  <div className="flex items-center gap-2">
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
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-foliage-dark font-bold text-xl">
                      ₹{product.discount 
                        ? Math.round(product.price * (1 - product.discount / 100))
                        : product.price
                      }
                    </span>
                    {product.discount && (
                      <span className="text-gray-500 line-through text-sm">
                        ₹{product.price}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Specifications Comparison */}
          {allSpecs.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium">Specification</th>
                      {displayedProducts.map(product => (
                        <th key={product.id} className="text-left py-2 px-4 font-medium">
                          {product.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allSpecs.map(spec => (
                      <tr key={spec} className="border-b border-gray-100">
                        <td className="py-2 px-4 font-medium text-gray-700">{spec}</td>
                        {displayedProducts.map(product => (
                          <td key={product.id} className="py-2 px-4">
                            {product.specifications?.[spec] || (
                              <Minus className="h-4 w-4 text-gray-400" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Features Comparison */}
          {allFeatures.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium">Feature</th>
                      {displayedProducts.map(product => (
                        <th key={product.id} className="text-left py-2 px-4 font-medium">
                          {product.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allFeatures.map(feature => (
                      <tr key={feature} className="border-b border-gray-100">
                        <td className="py-2 px-4 font-medium text-gray-700">{feature}</td>
                        {displayedProducts.map(product => (
                          <td key={product.id} className="py-2 px-4 text-center">
                            {product.features?.includes(feature) ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Minus className="h-4 w-4 text-gray-400" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            {displayedProducts.map(product => (
              <Button
                key={product.id}
                className="flex-1 bg-foliage hover:bg-foliage-dark"
              >
                Add {product.name} to Cart
              </Button>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};
