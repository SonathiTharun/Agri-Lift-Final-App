
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { WeatherWidget } from "@/components/WeatherWidget";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  stock: number;
};

// Mock data for products in each category
const productsByCategory: Record<string, Product[]> = {
  "lab-grown-plants": [
    {
      id: "lg-plant-1",
      name: "High-Yield Rice Seedling",
      description: "Lab-grown rice seedlings with 30% higher yield potential",
      price: 199,
      image: "https://images.unsplash.com/photo-1628684582941-abfbf5732f0e?q=80&w=2080&auto=format&fit=crop",
      rating: 4.7,
      stock: 120
    },
    {
      id: "lg-plant-2",
      name: "Disease-Resistant Wheat",
      description: "Wheat seedlings engineered to resist common fungal diseases",
      price: 249,
      image: "https://images.unsplash.com/photo-1536704515403-0b54f32be3aa?q=80&w=2069&auto=format&fit=crop",
      rating: 4.5,
      stock: 85
    },
    {
      id: "lg-plant-3",
      name: "Drought-Tolerant Corn",
      description: "Corn plants designed to thrive in low-water conditions",
      price: 279,
      image: "https://images.unsplash.com/photo-1601329378636-b2f48bb6de76?q=80&w=2078&auto=format&fit=crop",
      rating: 4.8,
      stock: 63
    },
    {
      id: "lg-plant-4",
      name: "Fast-Growing Vegetable Set",
      description: "Collection of tomato, cucumber, and bell pepper lab-grown seedlings",
      price: 349,
      image: "https://images.unsplash.com/photo-1528825539566-2bcb5882445c?q=80&w=2070&auto=format&fit=crop",
      rating: 4.6,
      stock: 42
    }
  ],
  "seeds": [
    {
      id: "seeds-1",
      name: "Premium Hybrid Tomato Seeds",
      description: "High-germination tomato seeds for larger, juicier tomatoes",
      price: 89,
      image: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?q=80&w=2070&auto=format&fit=crop",
      rating: 4.5,
      stock: 200
    },
    {
      id: "seeds-2",
      name: "Organic Carrot Seeds",
      description: "100% organic carrot seeds with high sugar content",
      price: 59,
      image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?q=80&w=2070&auto=format&fit=crop",
      rating: 4.3,
      stock: 150
    },
    {
      id: "seeds-3",
      name: "Watermelon Seed Mix",
      description: "Mix of three premium watermelon varieties",
      price: 99,
      image: "https://plus.unsplash.com/premium_photo-1661776814207-061cb2b7a9d1?q=80&w=2070&auto=format&fit=crop",
      rating: 4.7,
      stock: 85
    },
    {
      id: "seeds-4",
      name: "Herb Garden Seed Kit",
      description: "Complete herb garden seed kit with 10 popular herbs",
      price: 129,
      image: "https://images.unsplash.com/photo-1619542402805-a6fff4407b9f?q=80&w=1932&auto=format&fit=crop",
      rating: 4.9,
      stock: 60
    }
  ],
  "fertilizers": [
    {
      id: "fert-1",
      name: "All-Purpose Organic Fertilizer",
      description: "Balanced nutrients for most crops and garden plants",
      price: 299,
      image: "https://images.unsplash.com/photo-1615412704911-55d589229864?q=80&w=2070&auto=format&fit=crop",
      rating: 4.4,
      stock: 75
    },
    {
      id: "fert-2",
      name: "Slow-Release Granular Fertilizer",
      description: "Long-lasting fertilizer that feeds plants for up to 6 months",
      price: 399,
      image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=2070&auto=format&fit=crop",
      rating: 4.6,
      stock: 50
    },
    {
      id: "fert-3",
      name: "Liquid Seaweed Fertilizer",
      description: "Natural seaweed extract to boost plant growth and health",
      price: 179,
      image: "https://images.unsplash.com/photo-1576158114254-3b8ac9df9adf?q=80&w=2080&auto=format&fit=crop",
      rating: 4.8,
      stock: 120
    },
    {
      id: "fert-4",
      name: "Specialized Fruit Tree Fertilizer",
      description: "Formulated specifically for fruit-bearing trees and shrubs",
      price: 349,
      image: "https://images.unsplash.com/photo-1658490858699-ea28503c7d4b?q=80&w=2069&auto=format&fit=crop",
      rating: 4.5,
      stock: 65
    }
  ],
  "pesticides": [
    {
      id: "pest-1",
      name: "Organic Insect Spray",
      description: "Natural insect control safe for edible plants",
      price: 159,
      image: "https://images.unsplash.com/photo-1527367888476-abf53aaf7bf1?q=80&w=2070&auto=format&fit=crop",
      rating: 4.3,
      stock: 90
    },
    {
      id: "pest-2",
      name: "Fungicide Solution",
      description: "Controls powdery mildew, rust, and other fungal diseases",
      price: 219,
      image: "https://images.unsplash.com/photo-1603256811365-19a4ccc3beb0?q=80&w=2071&auto=format&fit=crop",
      rating: 4.5,
      stock: 70
    },
    {
      id: "pest-3",
      name: "Weed Control Concentrate",
      description: "Concentrated solution for effective weed management",
      price: 289,
      image: "https://images.unsplash.com/photo-1560806853-c492a5d166b4?q=80&w=2017&auto=format&fit=crop",
      rating: 4.4,
      stock: 55
    },
    {
      id: "pest-4",
      name: "Rodent Repellent",
      description: "Natural rodent deterrent to protect seeds and crops",
      price: 199,
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2071&auto=format&fit=crop",
      rating: 4.2,
      stock: 80
    }
  ]
};

// Category name mapping
const categoryNames: Record<string, string> = {
  "lab-grown-plants": "Lab Grown Plants",
  "seeds": "Seeds",
  "fertilizers": "Fertilizers",
  "pesticides": "Pesticides"
};

export default function ProductDetail() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [cart, setCart] = useState<Record<string, number>>(() => {
    const savedCart = localStorage.getItem('agrilift-cart');
    return savedCart ? JSON.parse(savedCart) : {};
  });
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('agrilift-cart', JSON.stringify(cart));
  }, [cart]);

  if (!category || !productsByCategory[category]) {
    return <div>Category not found</div>;
  }

  const products = productsByCategory[category];
  const categoryName = categoryNames[category] || "Products";

  const addToCart = (productId: string) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      newCart[productId] = (newCart[productId] || 0) + 1;
      return newCart;
    });
    
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    });
  };

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  const goToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soil-light/10 to-foliage-light/10">
      <Navbar />
      
      {/* Weather Widget (Draggable) */}
      <WeatherWidget />
      
      <main className="container mx-auto pt-20 px-4 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/market')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to categories
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-soil-dark">{categoryName}</h1>
          </div>
          
          {getTotalCartItems() > 0 && (
            <Button onClick={goToCheckout} className="bg-foliage hover:bg-foliage-dark">
              <ShoppingCart className="mr-2 h-4 w-4" /> 
              Cart ({getTotalCartItems()})
            </Button>
          )}
        </div>
        
        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden h-full flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-0 flex-grow">
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold text-lg">₹{product.price}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm ml-1">{product.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => addToCart(product.id)} 
                  className="w-full bg-foliage hover:bg-foliage-dark" 
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
