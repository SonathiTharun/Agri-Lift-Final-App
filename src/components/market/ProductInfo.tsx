
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart, ShoppingCart, Check, Info, Shield, Truck, Award } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  discount?: number;
  specifications?: Record<string, string>;
  benefits?: string[];
  categoryId?: string;
}

interface ProductInfoProps {
  product: Product;
  categoryId?: string;
  quantity: number;
  updateQuantity: (delta: number) => void;
  handleAddToCart: () => void;
  isAddedToCart: boolean;
}

export const ProductInfo = ({ 
  product, 
  categoryId, 
  quantity, 
  updateQuantity, 
  handleAddToCart, 
  isAddedToCart 
}: ProductInfoProps) => {
  const [activeTab, setActiveTab] = useState("description");

  const finalPrice = product.discount 
    ? Math.round(product.price * (1 - product.discount / 100)) 
    : product.price;

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        {/* Category label */}
        <div className="text-sm text-gray-500 mb-1">
          {categoryId && categoryId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
        
        {/* Rating and Stock */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < product.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">({product.rating.toFixed(1)})</span>
          </div>
          
          <Badge 
            variant="outline" 
            className={`${product.stock > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
          >
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </Badge>
        </div>
      </div>
      
      {/* Price */}
      <div className="bg-gray-50 p-4 rounded-lg">
        {product.discount ? (
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-foliage-dark">₹{finalPrice}</span>
            <span className="text-lg text-gray-500 line-through">₹{product.price}</span>
            <Badge className="bg-red-500 border-0">{product.discount}% OFF</Badge>
          </div>
        ) : (
          <span className="text-3xl font-bold text-foliage-dark">₹{product.price}</span>
        )}
        <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
      </div>
      
      {/* Short Description */}
      <p className="text-gray-700 leading-relaxed">{product.description}</p>
      
      {/* Trust badges */}
      <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center">
          <Shield className="h-4 w-4 mr-1 text-foliage" /> Quality Guarantee
        </div>
        <div className="flex items-center">
          <Truck className="h-4 w-4 mr-1 text-foliage" /> Fast Shipping
        </div>
        <div className="flex items-center">
          <Award className="h-4 w-4 mr-1 text-foliage" /> Top-Rated Products
        </div>
      </div>
      
      {/* Quantity and Add to Cart */}
      <div className="flex items-center gap-4 mt-6">
        <div className="flex items-center border rounded-md shadow-sm">
          <motion.button 
            className="px-4 py-2 border-r text-gray-700"
            onClick={() => updateQuantity(-1)}
            disabled={quantity <= 1}
            whileTap={{ scale: 0.95 }}
          >
            -
          </motion.button>
          <span className="px-6 py-2 font-medium">{quantity}</span>
          <motion.button 
            className="px-4 py-2 border-l text-gray-700"
            onClick={() => updateQuantity(1)}
            whileTap={{ scale: 0.95 }}
          >
            +
          </motion.button>
        </div>
        
        <motion.div 
          className="flex-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 py-6 ${isAddedToCart ? 'bg-green-600 hover:bg-green-700' : 'bg-foliage hover:bg-foliage-dark'}`}
            disabled={product.stock <= 0}
            size="lg"
          >
            {isAddedToCart ? (
              <>
                <Check className="h-5 w-5" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </>
            )}
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="outline" size="icon" className="bg-white h-12 w-12 rounded-full border-gray-200 hover:bg-foliage hover:text-white hover:border-foliage">
            <Heart className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
      
      {/* Additional Info Tabs */}
      <div className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1 rounded-lg">
            <TabsTrigger value="description" className="data-[state=active]:bg-white data-[state=active]:text-foliage-dark data-[state=active]:shadow-sm">
              Description
            </TabsTrigger>
            <TabsTrigger value="specifications" className="data-[state=active]:bg-white data-[state=active]:text-foliage-dark data-[state=active]:shadow-sm">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="benefits" className="data-[state=active]:bg-white data-[state=active]:text-foliage-dark data-[state=active]:shadow-sm">
              Benefits
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                <p className="mt-4 text-gray-700 leading-relaxed">
                  Perfect for agriculture enthusiasts and professional farmers alike, this product has been designed to enhance your farming experience and increase productivity.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications" className="mt-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                {product.specifications ? (
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="border-b pb-2 flex justify-between">
                        <span className="font-medium text-gray-600">{key}: </span>
                        <span className="text-gray-800">{value as string}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500 justify-center p-4 bg-gray-50 rounded">
                    <Info className="h-4 w-4" />
                    <span>No specifications available for this product.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="benefits" className="mt-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                {product.benefits && product.benefits.length > 0 ? (
                  <ul className="space-y-2">
                    {product.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500 justify-center p-4 bg-gray-50 rounded">
                    <Info className="h-4 w-4" />
                    <span>No benefits listed for this product.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};
