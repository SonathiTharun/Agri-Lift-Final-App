
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Star } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  stock: number;
  discount?: number;
  images?: string[];
  specifications?: Record<string, string>;
  benefits?: string[];
};

// Mock data for products in each category
const productsByCategory: Record<string, Product[]> = {
  "lab-grown-plants": [
    {
      id: "lg-plant-1",
      name: "High-Yield Rice Seedling",
      description: "Lab-grown rice seedlings with 30% higher yield potential. These genetically optimized seedlings are designed to maximize output while maintaining resistance to common diseases that affect rice crops.",
      price: 199,
      image: "https://media.istockphoto.com/id/2199060174/photo/lush-green-rice-fields-in-taiwan-during-the-growing-season.webp?a=1&b=1&s=612x612&w=0&k=20&c=E5jYkLX3rLbd4JjNQHAwZSENqQKdE0-FYgBCWN6rcec=",
      rating: 4.7,
      stock: 120,
      discount: 15,
      images: [
        "https://media.istockphoto.com/id/2199060174/photo/lush-green-rice-fields-in-taiwan-during-the-growing-season.webp?a=1&b=1&s=612x612&w=0&k=20&c=E5jYkLX3rLbd4JjNQHAwZSENqQKdE0-FYgBCWN6rcec=",
        "https://media.istockphoto.com/id/1282569924/photo/rice-field-at-sunset.webp?a=1&b=1&s=612x612&w=0&k=20&c=JjsJe_lYF-3qC_Z9MFy0FbYaWGJxhHRpH1F8-4F2GGU=",
        "https://media.istockphoto.com/id/1056248814/photo/farmer-planting-rice-seedlings-in-rice-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=oDzDICxikxUgnO6moFpcTaXHwOVR2iBSzqj3hH6-MiE="
      ],
      specifications: {
        "Growth Rate": "30% faster than traditional varieties",
        "Disease Resistance": "High resistance to blast and bacterial blight",
        "Water Requirements": "20% less than traditional varieties",
        "Expected Yield": "8-10 tons per hectare"
      },
      benefits: [
        "Higher yield potential compared to traditional varieties",
        "Reduced need for pesticides due to enhanced disease resistance",
        "Greater tolerance to environmental stress factors",
        "More efficient water usage"
      ]
    },
    {
      id: "lg-plant-2",
      name: "Disease-Resistant Wheat",
      description: "Wheat seedlings engineered to resist common fungal diseases",
      price: 249,
      image: "https://media.istockphoto.com/id/983287672/photo/close-up-on-ripe-wheat-ears-on-reaping-time-in-middle-june.webp?a=1&b=1&s=612x612&w=0&k=20&c=ie2OOz5kDNy75bXzurOf1nu9WlXhHmfD8MQCe2jJ-wk=",
      rating: 4.5,
      stock: 85,
      discount: 10
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
      stock: 200,
      discount: 5
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
      description: "High-quality organic gourd seeds for healthy farming",
      price: 99,
      image: "https://media.istockphoto.com/id/502490988/photo/bottle-gourd-plant-with-young-fruit.webp?a=1&b=1&s=612x612&w=0&k=20&c=MxnSAJYrNkoeKQyieI-dp9UDQDX_oWwZNeT2R-ncpl8=",
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
    },
    {
      id: "seed-5",
      name: "Premium Carrot Seeds",
      description: "High-germination carrot seeds for abundant harvests",
      price: 79,
      image: "https://media.istockphoto.com/id/1431027073/photo/carrot-seeds-in-hand.webp?a=1&b=1&s=612x612&w=0&k=20&c=YXJ-pnLj-ulMR9KVpCq6eQoAw_GyWQb6pWUrKCbPzVU=",
      rating: 4.7,
      stock: 220
    },
    {
      id: "seed-6",
      name: "Organic Lettuce Seed Mix",
      description: "A blend of premium organic lettuce varieties",
      price: 89,
      image: "https://media.istockphoto.com/id/172875087/photo/lettuce-seedlings.webp?a=1&b=1&s=612x612&w=0&k=20&c=VDoD6YkTLVZzjbwYqd9XoTdhJU8ElgleFPKPd0MUMtk=",
      rating: 4.6,
      stock: 150
    }
  ],
  "fertilizers": [
    {
      id: "fert-1",
      name: "Premium Organic Compost",
      description: "Nutrient-rich organic compost for all your farming needs",
      price: 149,
      image: "https://media.istockphoto.com/id/1198255281/photo/professional-gardener-adds-compost-to-the-soil-in-the-garden.webp?a=1&b=1&s=612x612&w=0&k=20&c=1KLUuAP1w_kEzQ7aCKSz6WRtC3AW8eSXIHi_5xpHtKc=",
      rating: 4.9,
      stock: 300
    },
    {
      id: "fert-2",
      name: "NPK Fertilizer Blend",
      description: "Balanced nitrogen, phosphorus, and potassium for optimal growth",
      price: 199,
      image: "https://media.istockphoto.com/id/927499422/photo/organic-fertilizer-in-a-wooden-bowl-on-dark-background-alternative-resource-of-fertilizer-for.webp?a=1&b=1&s=612x612&w=0&k=20&c=XViyaUlbE_AFT1JuhfDo4yWzXuMnYr1et9mZqV97DCA=",
      rating: 4.7,
      stock: 250,
      discount: 10
    },
    {
      id: "fert-3",
      name: "Organic Bone Meal",
      description: "Slow-release fertilizer perfect for root development",
      price: 129,
      image: "https://media.istockphoto.com/id/1414162899/photo/bone-meal-organic-fertilizer-in-packaging-on-wooden-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=LQF4dxjpCjpnM-1EUIv8X-5EHc8C5NGjM8Vl_78R28s=",
      rating: 4.6,
      stock: 175
    },
    {
      id: "fert-4",
      name: "Liquid Seaweed Fertilizer",
      description: "Nutrient-rich seaweed extract for boosting plant health",
      price: 109,
      image: "https://media.istockphoto.com/id/1314115085/photo/organic-liquid-fertilizers.webp?a=1&b=1&s=612x612&w=0&k=20&c=R4rPu9TbJQ8FO05Re3zI0wkyPMeZFTwWCxN7poLkCrQ=",
      rating: 4.8,
      stock: 200
    }
  ],
  "pesticides": [
    {
      id: "pest-1",
      name: "Organic Pest Control Spray",
      description: "Natural formula to control common plant pests",
      price: 89,
      image: "https://media.istockphoto.com/id/1217779052/photo/farmer-spraying-vegetables-with-chemicals-in-the-garden.webp?a=1&b=1&s=612x612&w=0&k=20&c=r7Mfptx_suxSOkL5PhVcqBGdCTax1_Qvkr7aHWCeVFc=",
      rating: 4.5,
      stock: 150
    },
    {
      id: "pest-2",
      name: "Neem Oil Concentrate",
      description: "Organic solution for pest and fungal control",
      price: 69,
      image: "https://media.istockphoto.com/id/1398630956/photo/neem-oil-extract-in-bottle-on-wooden-surface-selective-focus-ayurvedic-medicine.webp?a=1&b=1&s=612x612&w=0&k=20&c=4i6gVZdHeWSPwdkcpzLzjsGSp9NByPFflgRSPtJJ4o8=",
      rating: 4.7,
      stock: 200,
      discount: 15
    },
    {
      id: "pest-3",
      name: "Insect Barrier Mesh",
      description: "Physical protection against flying pests",
      price: 129,
      image: "https://media.istockphoto.com/id/1371333320/photo/pigeons-and-other-birds-control-net-installed-in-balcony-celling.webp?a=1&b=1&s=612x612&w=0&k=20&c=yISvzG7xjVeyZEiQuE8H0iWv1Y8PWDbvRF7VotW-z2c=",
      rating: 4.6,
      stock: 80
    }
  ],
  "irrigation": [
    {
      id: "irrig-1",
      name: "Smart Drip Irrigation Kit",
      description: "Water-saving drip irrigation system with smart controls",
      price: 299,
      image: "https://media.istockphoto.com/id/1270064595/photo/watering-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=vzZ6GrpFj8RLNW8wvXEiWQzGDt91m0ASuFeiS-Eee2M=",
      rating: 4.8,
      stock: 50,
      discount: 20
    },
    {
      id: "irrig-2",
      name: "Sprinkler System - Pro",
      description: "Professional-grade sprinkler system for even coverage",
      price: 349,
      image: "https://media.istockphoto.com/id/1249603614/photo/sprinkler-head-watering-in-the-garden.webp?a=1&b=1&s=612x612&w=0&k=20&c=7XzfBxS68YoGX5AbDZPX7hQQ-gUgg0w9fqwx_QT5jC8=",
      rating: 4.7,
      stock: 35
    },
    {
      id: "irrig-3",
      name: "Smart Moisture Sensors",
      description: "IoT-enabled sensors to optimize watering schedules",
      price: 179,
      image: "https://media.istockphoto.com/id/1137813603/photo/hand-check-the-soil-moisture-with-the-mete.webp?a=1&b=1&s=612x612&w=0&k=20&c=x30Sl4TdjYF2bKtodXXoTisJ67UbTnzODRXR7Km9dWo=",
      rating: 4.9,
      stock: 75
    }
  ],
  "machinery": [
    {
      id: "mach-1",
      name: "Mini Tiller - Electric",
      description: "Compact electric tiller for small to medium gardens",
      price: 499,
      image: "https://media.istockphoto.com/id/1409689575/photo/farmer-plows-the-field-with-a-motor-cultivator.webp?a=1&b=1&s=612x612&w=0&k=20&c=kPo8LVYosclZLFJie7eXTRWHK90J01wEAlVCsEaYmQU=",
      rating: 4.6,
      stock: 20,
      discount: 10
    },
    {
      id: "mach-2",
      name: "Seed Planter - Precision",
      description: "Accurate seed planter for efficient sowing",
      price: 659,
      image: "https://media.istockphoto.com/id/1299978359/photo/tractor-with-a-mounted-precision-seed-drill-seeder-in-a-field-sunset-time.webp?a=1&b=1&s=612x612&w=0&k=20&c=s05dTgmErTDiWIfYL1LasYEkA6mLdfr8cGYy5QADr1U=",
      rating: 4.8,
      stock: 15
    }
  ]
};

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
      "irrigation": "Irrigation",
      "machinery": "Machinery"
    };
    return categoryMap[catId] || catId;
  };

  // Get related products excluding current one
  const relatedProducts = categoryId 
    ? productsByCategory[categoryId]
        .filter(p => p.id !== product.id)
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
                    {product.images.map((img, i) => (
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
                            <span className="text-sm">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {activeTab === "benefits" && product.benefits && (
                      <ul className="list-disc pl-5 space-y-1">
                        {product.benefits.map((benefit, index) => (
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
