
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { WeatherWidget } from "@/components/WeatherWidget";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Star, Info, ShoppingCart, Check } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { productsByCategory } from "@/data/marketData";
import { useCart } from "@/context/CartContext";

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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/market/${categoryId}`)}
            className="mb-6 animate-fade-in"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
          
          {/* Product Detail Main Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-fade-in">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image or Carousel */}
              <div className="aspect-square rounded-lg overflow-hidden border bg-white">
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
                    <CarouselPrevious />
                    <CarouselNext />
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
                    <div 
                      key={idx}
                      className={`h-20 w-20 flex-shrink-0 rounded border overflow-hidden cursor-pointer 
                        ${selectedImage === idx ? 'ring-2 ring-foliage' : ''}`}
                      onClick={() => setSelectedImage(idx)}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${idx + 1}`} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
              
              {/* Rating and Stock */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < product.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({product.rating.toFixed(1)})</span>
                </div>
                
                <Badge variant="outline" className={`${product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </Badge>
              </div>
              
              {/* Price */}
              <div className="mt-2">
                {product.discount ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foliage">₹{finalPrice}</span>
                    <span className="text-lg text-gray-500 line-through">₹{product.price}</span>
                    <Badge className="bg-red-500">{product.discount}% OFF</Badge>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-foliage">₹{product.price}</span>
                )}
                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>
              
              {/* Short Description */}
              <p className="text-gray-700">{product.description}</p>
              
              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center border rounded-md">
                  <button 
                    className="px-3 py-2 border-r"
                    onClick={() => updateQuantity(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button 
                    className="px-3 py-2 border-l"
                    onClick={() => updateQuantity(1)}
                  >
                    +
                  </button>
                </div>
                
                <Button 
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 ${isAddedToCart ? 'bg-green-600 hover:bg-green-700' : 'bg-foliage hover:bg-foliage-dark'}`}
                  disabled={product.stock <= 0}
                >
                  {isAddedToCart ? (
                    <>
                      <Check className="h-4 w-4" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </>
                  )}
                </Button>
                
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Additional Info */}
              <div className="pt-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="mt-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                      <p className="text-gray-700">{product.description}</p>
                      <p className="mt-2 text-gray-700">
                        Perfect for agriculture enthusiasts and professional farmers alike, this product has been designed to enhance your farming experience and increase productivity.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="specifications" className="mt-4">
                    {product.specifications ? (
                      <div className="p-4 bg-gray-50 rounded-md space-y-2">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="border-b pb-2">
                            <span className="font-medium text-sm text-gray-600">{key}: </span>
                            <span className="text-sm">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-md flex items-center gap-2 text-gray-500">
                        <Info className="h-4 w-4" />
                        <span>No specifications available for this product.</span>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="benefits" className="mt-4">
                    {product.benefits && product.benefits.length > 0 ? (
                      <div className="p-4 bg-gray-50 rounded-md">
                        <ul className="list-disc pl-5 space-y-1">
                          {product.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-gray-700">{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-md flex items-center gap-2 text-gray-500">
                        <Info className="h-4 w-4" />
                        <span>No benefits listed for this product.</span>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map(relatedProduct => (
                  <div 
                    key={relatedProduct.id} 
                    className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/market/${categoryId}/${relatedProduct.id}`)}
                  >
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium truncate">{relatedProduct.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-foliage">₹{relatedProduct.price}</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                          <span className="ml-1 text-xs text-gray-600">{relatedProduct.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
