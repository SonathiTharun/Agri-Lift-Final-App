
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Star, ChevronRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { productsByCategory } from "@/data/marketData";

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

  useEffect(() => {
    if (categoryId && productsByCategory[categoryId]) {
      const products = productsByCategory[categoryId];
      const foundProduct = productId 
        ? products.find(p => p.id === productId) 
        : products[0];
      
      setProduct(foundProduct || null);
    }
    
    // Reset state when product changes
    setQuantity(1);
    setSelectedImage(0);
    setActiveTab("description");
  }, [categoryId, productId]);

  const handleAddToCart = () => {
    // Here you would actually handle adding to cart with real functionality
    if (product) {
      toast({
        title: "Added to Cart",
        description: `${quantity} ${product.name} added to your cart`,
      });
    }
  };

  const handleBuyNow = () => {
    // Here you would handle direct checkout
    if (product) {
      toast({
        title: "Proceeding to Checkout",
        description: `${quantity} ${product.name} added for immediate purchase`,
      });
      navigate("/checkout");
    }
  };

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
                <ArrowLeft className="mr-2" /> Back
              </Button>
            </div>
            <Card className="animate-fade-in">
              <CardContent className="pt-6">
                <div className="text-center py-16">
                  <h2 className="text-xl font-semibold mb-2">Product not found</h2>
                  <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
                  <Button onClick={() => navigate('/market')}>Return to Market</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // Get category name for display
  const getCategoryName = (catId: string) => {
    const categoryMap: Record<string, string> = {
      "lab-grown-plants": "Lab Grown Plants",
      "seeds": "Seeds",
      "fertilizers": "Fertilizers",
      "pesticides": "Pesticides",
      "farming-tools": "Farming Tools",
      "irrigation": "Irrigation"
    };
    return categoryMap[catId] || catId;
  };

  // Get related products excluding current one
  const relatedProducts = categoryId 
    ? productsByCategory[categoryId]
        .filter(p => p.id !== product?.id)
        .slice(0, 4)
    : [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8 animate-fade-in">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/market/${categoryId}`)} 
              className="hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="mr-2" /> Back to {getCategoryName(categoryId || '')}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
            {/* Product Images */}
            <div className="rounded-lg overflow-hidden bg-white shadow-sm border">
              {product.images && product.images.length > 1 ? (
                <div className="space-y-4">
                  <div className="aspect-square w-full overflow-hidden">
                    <img 
                      src={product.images[selectedImage]} 
                      alt={product.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((img: string, i: number) => (
                      <div 
                        key={i} 
                        className={`w-20 h-20 flex-shrink-0 cursor-pointer border-2 overflow-hidden rounded ${
                          selectedImage === i ? "border-foliage" : "border-transparent"
                        }`}
                        onClick={() => setSelectedImage(i)}
                      >
                        <img 
                          src={img} 
                          alt={`${product.name} - View ${i+1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="aspect-square w-full overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl">{product.name}</CardTitle>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                        />
                      ))}
                      <span className="ml-2 text-gray-600">{product.rating.toFixed(1)}</span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-600">Stock: {product.stock} available</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foliage-dark flex items-center">
                      ${product.price}
                      {product.discount && (
                        <>
                          <span className="text-gray-400 text-lg line-through ml-2">
                            ${Math.round(product.price * (1 + product.discount / 100))}
                          </span>
                          <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {product.discount}% OFF
                          </span>
                        </>
                      )}
                    </h3>
                  </div>
                  
                  {/* Tabs for Description, Specifications, etc. */}
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                      <button
                        onClick={() => setActiveTab("description")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "description"
                            ? "border-foliage text-foliage"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Description
                      </button>
                      {product.specifications && (
                        <button
                          onClick={() => setActiveTab("specifications")}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "specifications"
                              ? "border-foliage text-foliage"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          Specifications
                        </button>
                      )}
                      {product.benefits && (
                        <button
                          onClick={() => setActiveTab("benefits")}
                          className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "benefits"
                              ? "border-foliage text-foliage"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          Benefits
                        </button>
                      )}
                    </nav>
                  </div>
                  
                  <div className="pt-2 min-h-[120px]">
                    {activeTab === "description" && (
                      <p className="text-gray-600">{product.description}</p>
                    )}
                    
                    {activeTab === "specifications" && product.specifications && (
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="border-b pb-2">
                            <span className="font-medium text-sm text-gray-600">{key}: </span>
                            <span className="text-sm">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {activeTab === "benefits" && product.benefits && (
                      <ul className="list-disc pl-5 space-y-1">
                        {product.benefits.map((benefit: string, index: number) => (
                          <li key={index} className="text-gray-600">{benefit}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Quantity</h4>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center">{quantity}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                        disabled={quantity >= product.stock}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="w-full bg-foliage hover:bg-foliage-dark transition-colors" 
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-foliage text-foliage hover:bg-foliage hover:text-white transition-colors" 
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Related Products</h3>
              <Link 
                to={`/market/${categoryId}`} 
                className="text-foliage hover:underline flex items-center"
              >
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {relatedProducts.length > 0 ? (
              <Carousel
                opts={{
                  align: "start",
                  loop: relatedProducts.length > 3,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {relatedProducts.map((relatedProduct) => (
                    <CarouselItem key={relatedProduct.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <Link to={`/market/${categoryId}/${relatedProduct.id}`}>
                        <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300 hover:border-foliage">
                          <div className="aspect-square overflow-hidden">
                            <img 
                              src={relatedProduct.image} 
                              alt={relatedProduct.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                            />
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-soil-dark truncate">{relatedProduct.name}</h4>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={`${
                                    i < Math.floor(relatedProduct.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-xs ml-1 text-gray-500">{relatedProduct.rating}</span>
                            </div>
                            <p className="text-foliage-dark font-bold mt-1">${relatedProduct.price}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4" />
                <CarouselNext className="-right-4" />
              </Carousel>
            ) : (
              <p className="text-center text-gray-500 py-8">No related products found</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
