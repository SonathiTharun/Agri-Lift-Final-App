
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Seed, Plant, Fertilizer, PlusCross } from "lucide-react";

type ProductCategory = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  image: string;
};

const categories: ProductCategory[] = [
  {
    id: "lab-grown-plants",
    name: "Lab Grown Plants",
    description: "High-yield, disease-resistant plants grown using advanced lab techniques",
    icon: <Plant className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1611843467160-25afb8df1074?q=80&w=2940&auto=format&fit=crop"
  },
  {
    id: "seeds",
    name: "Seeds",
    description: "Premium quality seeds with high germination rates for various crops",
    icon: <Seed className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1599533987883-8c40198b470e?q=80&w=2787&auto=format&fit=crop"
  },
  {
    id: "fertilizers",
    name: "Fertilizers",
    description: "Organic and chemical fertilizers for enhanced crop growth",
    icon: <Fertilizer className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1599942598277-2a99b937846d?q=80&w=2940&auto=format&fit=crop"
  },
  {
    id: "pesticides",
    name: "Pesticides",
    description: "Effective pest control solutions for healthier crops",
    icon: <PlusCross className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1621206093794-d970288a732d?q=80&w=2940&auto=format&fit=crop"
  }
];

export default function Market() {
  const [pageLoaded, setPageLoaded] = useState(false);

  // Simulate page loading
  useState(() => {
    setTimeout(() => setPageLoaded(true), 100);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-soil-light/10 to-foliage-light/10">
      <Navbar />
      
      {/* Weather Widget (Draggable) */}
      <WeatherWidget />
      
      <main className="container mx-auto pt-20 px-4 pb-10">
        <div className="max-w-5xl mx-auto text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-soil-dark mb-2">AgriLift Market</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our range of high-quality agricultural products to boost your farm's productivity
          </p>
        </div>
        
        {/* Product Categories */}
        <div className="grid md:grid-cols-2 gap-6 my-10 max-w-5xl mx-auto">
          {categories.map((category) => (
            <Link key={category.id} to={`/market/${category.id}`} className="group">
              <Card className="overflow-hidden border-2 border-transparent hover:border-foliage transition-all duration-300 h-full">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white">
                    <div className="p-2 bg-foliage rounded-full">{category.icon}</div>
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                  </div>
                </div>
                <CardContent className="py-4">
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full group-hover:bg-foliage group-hover:text-white">
                    Explore {category.name} <ShoppingCart className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {/* Trust Section */}
        <div className="mt-16 p-6 rounded-lg bg-gradient-to-r from-foliage-dark/10 to-foliage-light/10 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Why Choose AgriLift Market?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600">All our products undergo strict quality checks for better yield</p>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get products delivered to your doorstep within 3-5 business days</p>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
              <p className="text-gray-600">Our agricultural experts are available to guide you on best practices</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
