
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
      image: "https://media.istockphoto.com/id/2199060174/photo/lush-green-rice-fields-in-taiwan-during-the-growing-season.webp?a=1&b=1&s=612x612&w=0&k=20&c=E5jYkLX3rLbd4JjNQHAwZSENqQKdE0-FYgBCWN6rcec=",
      rating: 4.7,
      stock: 120
    },
    {
      id: "lg-plant-2",
      name: "Disease-Resistant Wheat",
      description: "Wheat seedlings engineered to resist common fungal diseases",
      price: 249,
      image: "https://media.istockphoto.com/id/983287672/photo/close-up-on-ripe-wheat-ears-on-reaping-time-in-middle-june.webp?a=1&b=1&s=612x612&w=0&k=20&c=ie2OOz5kDNy75bXzurOf1nu9WlXhHmfD8MQCe2jJ-wk=",
      rating: 4.5,
      stock: 85
    },
    {
      id: "lg-plant-3",
      name: "Drought-Tolerant Corn",
      description: "Corn plants designed to thrive in low-water conditions",
      price: 279,
      image: "https://media.istockphoto.com/id/1218144150/photo/plants.webp?a=1&b=1&s=612x612&w=0&k=20&c=e1jdZY90le1ls-4DDdF8jnJ1hiF7p14QIJnE0f6i7xA=",
      rating: 4.8,
      stock: 63
    },
    {
      id: "lg-plant-4",
      name: "Fast-Growing Vegetable Set",
      description: "Collection of tomato, cucumber, and bell pepper lab-grown seedlings",
      price: 349,
      image: "https://plus.unsplash.com/premium_photo-1677756430981-31e8977f572f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RmFzdCUyMEdyb3dpbmclMjBWZWdldGFibGUlMjBTZXQlMjBsYWIlMjBncm93bnxlbnwwfHwwfHx8MA%3D%3D",
      rating: 4.6,
      stock: 42
    },
    {
      id: "lg-plant-5",
      name: "Cold-Resistant Spinach",
      description: "Spinach seedlings that thrive in colder climates",
      price: 199,
      image: "https://media.istockphoto.com/id/1419939833/photo/arugula-seedlings-sprouted-from-the-seeds-in-the-garden.webp?a=1&b=1&s=612x612&w=0&k=20&c=bcSKbNQv382GhyNqF2KuqC6d8Wb6TIRgMtDuwhAtoyk=",
      rating: 4.7,
      stock: 100
    },
    {
      id: "lg-plant-6",
      name: "Salt-Tolerant Rice",
      description: "Rice seedlings engineered to grow in saline soils",
      price: 229,
      image: "https://media.istockphoto.com/id/1036579474/photo/rice-and-sake-cup.webp?a=1&b=1&s=612x612&w=0&k=20&c=qnugmk7hFyjeAMZGw7IMeH5WUdBrBQPQP_BkEA_xg8U=",
      rating: 4.6,
      stock: 75
    },
    {
      id: "lg-plant-7",
      name: "High-Protein Soybean",
      description: "Soybean plants with enhanced protein content for better nutrition",
      price: 259,
      image: "https://media.istockphoto.com/id/1324336237/photo/soy-milk-and-soy-on-the-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=iaUvgAdkoa0cDbMCAz5m3MW0u2-1jW3YBjSnJQkYznk=",
      rating: 4.8,
      stock: 90
    },
    {
      id: "lg-plant-8",
      name: "Pest-Resistant Eggplant",
      description: "Eggplant seedlings designed to resist common pests",
      price: 189,
      image: "https://api.deepai.org/job-view-file/ba82a04e-a346-4086-ad61-efd28c62f4d9/outputs/output.jpg",
      rating: 4.5,
      stock: 110
    }
  ],
  "seeds": [
  {
    id: "seed-1",
    name: "Organic Tomato Seeds",
    description: "High-quality organic tomato seeds for your garden",
    price: 99,
    image: " https://plus.unsplash.com/premium_photo-1723568420145-4b3f90ef6c02?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8T3JnYW5pYyUyMFRvbWF0byUyMFNlZWRzfGVufDB8fDB8fHww",
    rating: 4.6,
    stock: 200
  },
  {
    id: "seed-2",
    name: "Hybrid Corn Seeds",
    description: "Hybrid corn seeds for higher yield and disease resistance",
    price: 149,
    image: "https://media.istockphoto.com/id/1385753483/photo/corn-seeds-on-a-white-background-and-in-hand.webp?a=1&b=1&s=612x612&w=0&k=20&c=STB-c6g5BYmw9wv41Tg1UaT9Gz5ERrgD7JNJA0iCQ0o=",
    rating: 4.7,
    stock: 150
  },
  {
    id: "seed-3",
    name: "Organic Bottleguard Seeds",
    description: "High-quality organic tomato seeds for healthy farming",
    price: 99,
    image: "data:image/jpeg;base64,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",
    rating: 4.5,
    stock: 200
  },
  {
    id: "seed-4",
    name: "Wheat Seeds - Premium Quality",
    description: "Clean, certified wheat seeds for optimal production",
    price: 129,
    image: "https://media.istockphoto.com/id/2197402001/photo/portrait-of-young-farmer-man-hold-wheat-isolated-on-white-background-stock-photo.webp?a=1&b=1&s=612x612&w=0&k=20&c=162aDhS92mLBZp0SdRJfMwlHynIGzOlvpGJd_bC7wuE=",
    rating: 4.6,
    stock: 180
  },
  {
    id: "seed-5",
    name: "Paddy Seeds (IR-64)",
    description: "High-yielding paddy seeds suitable for Indian soil",
    price: 139,
    image: "https://media.istockphoto.com/id/901829854/photo/cropped-image-of-senior-farmer-by-wheat-crop.webp?a=1&b=1&s=612x612&w=0&k=20&c=j9rVglFeMsvqizSH8byRZIJUNzocXfTHLtshieAawNU=",
    rating: 4.4,
    stock: 160
  },
  {
    id: "seed-6",
    name: "Brinjal (Eggplant) Seeds",
    description: "Disease-resistant hybrid brinjal seeds",
    price: 89,
    image: "https://www.naatigrains.com/image/cache/catalog/naatigrains-products/NG159/brinjal-green-blue-seed-vitamins-nutrition-order-vegetable-naatigrains-1000x1000.jpg",
    rating: 4.3,
    stock: 140
  },
  {
    id: "seed-7",
    name: "Carrot Seeds - Red",
    description: "Winter-special red carrot seeds with great taste",
    price: 79,
    image: "https://media.istockphoto.com/id/1367064446/photo/carrot-seeds.webp",
    rating: 4.5,
    stock: 120
  },
  {
    id: "seed-8",
    name: "Spinach Seeds",
    description: "Fast-growing spinach seeds rich in nutrition",
    price: 59,
    image: "https://media.istockphoto.com/id/1126733341/photo/spinach-seeds.webp",
    rating: 4.6,
    stock: 170
  }
],

  "fertilizers": [
    {
      id: "fert-1",
      name: "Nitrogen-Rich Fertilizer",
      description: "Boosts plant growth with high nitrogen content",
      price: 299,
      image: "https://media.istockphoto.com/id/1218144150/photo/fertilizer.webp",
      rating: 4.8,
      stock: 50
    }
  ],
  "pesticides": [
    {
      id: "pest-1",
      name: "Eco-Friendly Pesticide",
      description: "Protects plants from pests without harming the environment",
      price: 199,
      image: "https://media.istockphoto.com/id/1218144150/photo/pesticide.webp",
      rating: 4.5,
      stock: 75
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
