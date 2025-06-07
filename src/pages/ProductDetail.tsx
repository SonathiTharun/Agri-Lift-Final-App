
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { WeatherWidget } from "@/components/WeatherWidget";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { productsByCategory } from "@/data/marketData";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { ProductImageCarousel } from "@/components/market/ProductImageCarousel";
import { ProductInfo } from "@/components/market/ProductInfo";
import { RelatedProducts } from "@/components/market/RelatedProducts";

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

export default function ProductDetail() {
  const { categoryId, productId } = useParams<{ categoryId: string; productId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
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
            <ProductImageCarousel product={product} />
            
            <ProductInfo 
              product={product}
              categoryId={categoryId}
              quantity={quantity}
              updateQuantity={updateQuantity}
              handleAddToCart={handleAddToCart}
              isAddedToCart={isAddedToCart}
            />
          </div>
          
          {/* Related Products Section */}
          <RelatedProducts 
            relatedProducts={relatedProducts}
            categoryId={categoryId}
            navigate={navigate}
          />
        </div>
      </div>
    </Layout>
  );
}
