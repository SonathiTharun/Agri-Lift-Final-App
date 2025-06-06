
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { WeatherWidget } from "@/components/WeatherWidget";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Star, Info, ShoppingCart, Check, ChevronRight, Shield, Truck, Award } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { productsByCategory } from "@/data/marketData";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

// Define a proper type for the product
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  image: string;
  images?: string[];
  discount?: number;
  specifications?: Record<string, string>;
  benefits?: string[];
  categoryId?: string;
}

// Related Product Card component
const RelatedProductCard = ({ product, categoryId, navigate }) => {
  return (
    <motion.div 
      className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/market/${categoryId}/${product.id}`)}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-foliage">₹{product.price}</span>
          <div className="flex items-center">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span className="ml-1 text-xs text-gray-600">{product.rating}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main component
export default function ProductDetail() {
  const { categoryId, productId } = useParams<{ categoryId: string; productId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const { addToCart, cart } = useCart();

  // Fetch product data
  useEffect(() => {
    if (categoryId && productId) {
      const category = productsByCategory[categoryId];
      if (category) {
        const foundProduct = category.find(p => p.id === productId);
        if (foundProduct) {
          setProduct({ ...foundProduct, categoryId });
          return;
        }
      }
      // Product not found, redirect to category page
      navigate(`/market/${categoryId}`);
    }
  }, [categoryId, productId, navigate]);

  // Check if product is already in cart
  useEffect(() => {
    if (product && cart[product.id]) {
      setIsAddedToCart(true);
    } else {
      setIsAddedToCart(false);
    }
  }, [product, cart]);

  // Loading state
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-6 w-1/4 bg-gray-200 rounded mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square bg-gray-200 rounded"></div>
                <div className="space-y-4">
                  <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                  <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-10 w-full bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate discount price if available
  const finalPrice = product.discount 
    ? Math.round(product.price * (1 - product.discount / 100)) 
    : product.price;
  
  // Get related products excluding current one
  const relatedProducts = categoryId 
    ? productsByCategory[categoryId]
        .filter(p => p.id !== product?.id)
        .slice(0, 4)
    : [];

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(
      product.id,
      product.name,
      finalPrice,
      product.image,
      product.categoryId || "",
      quantity
    );
    setIsAddedToCart(true);
  };

  // Handle quantity change
  const updateQuantity = (delta: number) => {
    setQuantity(prev => {
      const newQuantity = prev + delta;
      return newQuantity > 0 ? newQuantity : 1;
    });
  };

  return (
    <Layout>
      <WeatherWidget />
      
      <div className="container mx-auto px-4 pb-10">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb / Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(`/market/${categoryId}`)}
              className="group text-gray-600 hover:text-foliage-dark"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-[-2px] transition-transform" /> 
              Back to Products
            </Button>
          </motion.div>
          
          {/* Product Detail Main Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Main Image or Carousel */}
              <div className="aspect-square rounded-xl overflow-hidden border bg-white shadow-md">
                {product.images && product.images.length > 0 ? (
                  <Carousel>
                    <CarouselContent>
                      {product.images.map((img, idx) => (
                        <CarouselItem key={idx}>
                          <div className="h-full w-full flex items-center justify-center p-2">
                            <img 
                              src={img} 
                              alt={`${product.name} view ${idx + 1}`} 
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="bg-white/80 backdrop-blur-sm border-0 hover:bg-foliage hover:text-white" />
                    <CarouselNext className="bg-white/80 backdrop-blur-sm border-0 hover:bg-foliage hover:text-white" />
                  </Carousel>
                ) : (
                  <div className="h-full w-full flex items-center justify-center p-2">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <motion.div 
                      key={idx}
                      className={`h-20 w-20 flex-shrink-0 rounded-lg border overflow-hidden cursor-pointer 
                        ${selectedImage === idx ? 'ring-2 ring-foliage' : ''}`}
                      onClick={() => setSelectedImage(idx)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${idx + 1}`} 
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
            
            {/* Product Info */}
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
              
              {/* Additional Info */}
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
          </div>
          
          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <motion.div 
              className="mt-16" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="w-1.5 h-6 bg-foliage rounded-full mr-3"></div>
                  <h2 className="text-2xl font-bold text-gray-800">Related Products</h2>
                </div>
                <Button variant="ghost" className="text-foliage font-medium" onClick={() => navigate(`/market/${categoryId}`)}>
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map(relatedProduct => (
                  <RelatedProductCard 
                    key={relatedProduct.id}
                    product={relatedProduct}
                    categoryId={categoryId}
                    navigate={navigate}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
