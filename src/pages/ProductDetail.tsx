
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
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
      image: "https://plus.unsplash.com/premium_photo-1723568420145-4b3f90ef6c02?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8T3JnYW5pYyUyMFRvbWF0byUyMFNlZWRzfGVufDB8fDB8fHww",
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
      image: "https://media.istockphoto.com/id/1345650890/photo/wheat-and-grain-in-hand-wheat-grain-kernel.jpg?s=612x612&w=0&k=20&c=KpOkbRUbFC5vD2e_X0DZ1KXBmnJzzIPDHnfCAhDB1x0=",
      rating: 4.8,
      stock: 180
    }
  ]
};

// Main component
export default function ProductDetail() {
  const { categoryId, productId } = useParams<{ categoryId: string; productId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (categoryId && productId) {
      const foundProduct = productsByCategory[categoryId]?.find(p => p.id === productId);
      setProduct(foundProduct || null);
    }
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/market/${categoryId}`)} 
              className="hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="mr-2" /> Back to {categoryId === "lab-grown-plants" ? "Lab Grown Plants" : "Seeds"}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
            {/* Product Image */}
            <div className="rounded-lg overflow-hidden bg-white shadow-sm border">
              <div className="aspect-square w-full overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Product Details */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl">{product.name}</CardTitle>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-gray-600">{product.rating.toFixed(1)}</span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-600">Stock: {product.stock} available</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foliage-dark">
                      ${product.price}
                    </h3>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-gray-600">{product.description}</p>
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
                
                <CardFooter>
                  <Button 
                    className="w-full bg-foliage hover:bg-foliage-dark transition-colors" 
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16 animate-fade-in">
            <h3 className="text-2xl font-semibold mb-6">Related Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productsByCategory[categoryId || '']?.
                filter(p => p.id !== product.id)
                .slice(0, 4)
                .map(relatedProduct => (
                  <Link 
                    key={relatedProduct.id}
                    to={`/market/${categoryId}/${relatedProduct.id}`}
                    className="group"
                  >
                    <Card className="h-full hover:shadow-md transition-shadow duration-300 hover:border-foliage">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={relatedProduct.image} 
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-soil-dark truncate">{relatedProduct.name}</h4>
                        <p className="text-foliage-dark font-bold mt-1">${relatedProduct.price}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

