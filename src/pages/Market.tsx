
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart, 
  Filter,
  ChevronRight,
  Star,
  Leaf,
  Sprout,
  FlaskConical,
  Flower,
  Shovel
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { categories, featuredProducts } from "@/data/marketData";

// Helper function to render the correct icon based on icon name
const renderIcon = (iconName: string) => {
  switch (iconName) {
    case "Sprout":
      return <Sprout className="h-6 w-6" />;
    case "Leaf":
      return <Leaf className="h-6 w-6" />;
    case "FlaskConical":
      return <FlaskConical className="h-6 w-6" />;
    case "Flower":
      return <Flower className="h-6 w-6" />;
    case "Shovel":
      return <Shovel className="h-6 w-6" />;
    default:
      return <Leaf className="h-6 w-6" />; // Default icon as fallback
  }
};

export default function Market() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const { t } = useLanguage();

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  const filterButtons = [
    { id: "all", label: "All" },
    { id: "lab-grown-plants", label: "Plants" },
    { id: "seeds", label: "Seeds" },
    { id: "fertilizers", label: "Fertilizers" },
    { id: "pesticides", label: "Pesticides" },
    { id: "farming-tools", label: "Tools" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-soil-light/10 to-foliage-light/10">
      <Navbar />
      
      {/* Weather Widget (Draggable) */}
      <WeatherWidget />
      
      <main className="container mx-auto pt-28 px-4 pb-16">
        <div className="max-w-5xl mx-auto text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-soil-dark mb-2">{t("market-title")}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("market-description")}
          </p>
        </div>

        {/* Featured Products Carousel */}
        <div className="my-12 max-w-5xl mx-auto animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-soil-dark">Featured Products</h2>
            <Link to="/market" className="text-foliage hover:underline flex items-center">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <Link to={`/market/${product.categoryId}/${product.id}`}>
                    <Card className="h-full overflow-hidden border-2 border-transparent hover:border-foliage transition-all duration-300 hover:shadow-lg">
                      <div className="relative h-48 overflow-hidden">
                        {product.discount && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white font-bold px-2 py-1 rounded-full z-10 animate-pulse">
                            -{product.discount}%
                          </div>
                        )}
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <CardContent className="py-4">
                        <h3 className="font-semibold text-lg text-soil-dark">{product.name}</h3>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${
                                i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-1">{product.rating}</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
                        <div className="mt-2">
                          <span className="text-foliage-dark font-bold text-lg">${product.price}</span>
                          {product.discount && (
                            <span className="text-gray-500 line-through ml-2">
                              ${Math.round(product.price * (1 + product.discount / 100))}
                            </span>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full hover:bg-foliage hover:text-white">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
        
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 my-8 max-w-5xl mx-auto animate-fade-in">
          <Button 
            variant="outline" 
            size="sm" 
            className={`rounded-full ${filterOpen ? 'bg-foliage text-white' : ''}`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={16} className="mr-1" /> Filters
          </Button>
          
          {filterButtons.map((btn) => (
            <Button
              key={btn.id}
              variant="outline"
              size="sm"
              className={`rounded-full ${activeFilter === btn.id ? 'bg-foliage text-white' : ''}`}
              onClick={() => setActiveFilter(btn.id)}
            >
              {btn.label}
            </Button>
          ))}
        </div>

        {/* Product Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-10 max-w-5xl mx-auto">
          {categories.map((category) => (
            <Link key={category.id} to={`/market/${category.id}`} className="group">
              <Card className="overflow-hidden border-2 border-transparent hover:border-foliage transition-all duration-300 hover:shadow-lg h-full">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white">
                    <div className="p-2 bg-foliage rounded-full">
                      {renderIcon(category.icon)}
                    </div>
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                  </div>
                </div>
                <CardContent className="py-4">
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full group-hover:bg-foliage group-hover:text-white transition-colors">
                    Explore {category.name} <ShoppingCart className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {/* Trust Section */}
        <div className="mt-16 p-6 rounded-lg bg-gradient-to-r from-foliage-dark/10 to-foliage-light/10 max-w-5xl mx-auto animate-fade-in">
          <h2 className="text-2xl font-bold text-center mb-6">Why Choose AgriLift Market?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4 hover:bg-white/20 rounded-md transition-colors">
              <div className="bg-foliage text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600">All our products undergo strict quality checks for better yield</p>
            </div>
            <div className="p-4 hover:bg-white/20 rounded-md transition-colors">
              <div className="bg-foliage text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get products delivered to your doorstep within 3-5 business days</p>
            </div>
            <div className="p-4 hover:bg-white/20 rounded-md transition-colors">
              <div className="bg-foliage text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                {renderIcon(categories[0].icon)}
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
              <p className="text-gray-600">Our agricultural experts are available to guide you on best practices</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center max-w-3xl mx-auto animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Ready to Boost Your Farming Productivity?</h2>
          <p className="text-gray-600 mb-6">Join thousands of farmers who have improved their yields with our premium products</p>
          <Button className="bg-foliage hover:bg-foliage-dark text-white">
            Shop Now <ShoppingCart className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
