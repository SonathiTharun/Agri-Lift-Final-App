
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart, 
  Filter,
  ChevronRight,
  Star,
  Leaf,
  Sprout,
  FlaskConical,
  Flower,
  Shovel,
  TrendingUp,
  Truck,
  Shield
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
import { motion } from "framer-motion";
import LiveMarketTicker from "@/components/crop-allocation/realtime/LiveMarketTicker";

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

// Featured Product Card component for better reusability
const FeaturedProductCard = ({ product }) => {
  return (
    <Link to={`/market/${product.categoryId}/${product.id}`}>
      <motion.div 
        whileHover={{ scale: 1.03 }} 
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="relative h-48 overflow-hidden">
            {product.discount && (
              <Badge className="absolute top-2 right-2 bg-red-500 border-0 z-10 animate-pulse">
                -{product.discount}% OFF
              </Badge>
            )}
            <motion.img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover object-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <CardContent className="py-4 bg-gradient-to-b from-white to-gray-50">
            <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
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
            <div className="mt-2 flex items-center justify-between">
              <span className="text-foliage-dark font-bold text-lg">₹{product.price}</span>
              {product.discount && (
                <span className="text-gray-500 line-through text-sm">
                  ₹{Math.round(product.price * (1 + product.discount / 100))}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100">
            <Button variant="outline" className="w-full group hover:bg-foliage hover:text-white border-foliage text-foliage">
              <span>View Details</span>
              <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
};

// Category Card component
const CategoryCard = ({ category }) => {
  return (
    <Link key={category.id} to={`/market/${category.id}`} className="group">
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden border-0 shadow-lg group-hover:shadow-xl transition-all duration-300 h-full">
          <div className="h-48 overflow-hidden relative">
            <motion.img 
              src={category.image} 
              alt={category.name} 
              className="w-full h-full object-cover object-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-2 text-white">
              <div className="p-2 bg-foliage rounded-full shadow-lg">
                {renderIcon(category.icon)}
              </div>
              <h3 className="text-xl font-bold drop-shadow-md">{category.name}</h3>
            </div>
          </div>
          <CardContent className="py-4 bg-gradient-to-b from-white to-gray-50">
            <p className="text-gray-600 line-clamp-2">{category.description}</p>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100">
            <Button 
              variant="outline" 
              className="w-full group hover:bg-foliage hover:border-foliage hover:text-white border-foliage text-foliage transition-colors"
            >
              <span>Explore {category.name}</span>
              <ShoppingCart className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      
      {/* Weather Widget (Draggable) */}
      <WeatherWidget />
      
      <main className="container mx-auto pt-28 px-4 pb-16">
        <motion.div 
          className="max-w-5xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-800 font-medium text-sm mb-4">
            AgriLift Marketplace
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foliage-dark to-sky-dark">
            {t("market-title")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t("market-description")}
          </p>
        </motion.div>
        
        {/* Live Market Ticker */}
        <div className="max-w-5xl mx-auto mb-12">
          <LiveMarketTicker location="National" />
        </div>

        {/* Featured Products Carousel */}
        <motion.div 
          className="my-12 max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-1.5 h-8 bg-foliage rounded-full mr-3"></div>
              <h2 className="text-2xl font-bold">Featured Products</h2>
            </div>
            <Link to="/market" className="text-foliage hover:underline flex items-center font-medium">
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
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <FeaturedProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-4">
              <CarouselPrevious className="static transform-none bg-white border-gray-200 hover:bg-foliage hover:text-white hover:border-foliage transition-colors" />
              <CarouselNext className="static transform-none bg-white border-gray-200 hover:bg-foliage hover:text-white hover:border-foliage transition-colors" />
            </div>
          </Carousel>
        </motion.div>
        
        {/* Filter Bar */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-2 my-10 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-white py-2 px-4 rounded-full shadow-md flex flex-wrap items-center justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={`rounded-full border-gray-200 ${filterOpen ? 'bg-foliage text-white border-foliage' : ''}`}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter size={16} className="mr-1" /> Filters
            </Button>
            
            {filterButtons.map((btn) => (
              <Button
                key={btn.id}
                variant="outline"
                size="sm"
                className={`rounded-full border-gray-200 ${activeFilter === btn.id ? 'bg-foliage text-white border-foliage' : 'hover:bg-foliage/10'}`}
                onClick={() => setActiveFilter(btn.id)}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Product Categories */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-10 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </motion.div>

        {/* Trust Section */}
        <motion.div 
          className="mt-16 py-10 px-6 rounded-2xl bg-white shadow-lg max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="text-center mb-10">
            <div className="w-12 h-1 bg-foliage mx-auto mb-4"></div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Why Choose AgriLift Market?</h2>
            <p className="text-gray-600">The premium marketplace for farmers with quality guaranteed</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div 
              className="p-6 rounded-xl hover:bg-gray-50 transition-colors"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-green-100 text-foliage-dark p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600">All our products undergo strict quality checks for better yield</p>
            </motion.div>
            
            <motion.div 
              className="p-6 rounded-xl hover:bg-gray-50 transition-colors"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-blue-100 text-sky-dark p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get products delivered to your doorstep within 3-5 business days</p>
            </motion.div>
            
            <motion.div 
              className="p-6 rounded-xl hover:bg-gray-50 transition-colors"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-yellow-100 text-wheat-dark p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
              <p className="text-gray-600">Our agricultural experts are available to guide you on best practices</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="mt-20 text-center max-w-3xl mx-auto p-10 rounded-2xl bg-gradient-to-r from-foliage/10 to-sky/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Farming Productivity?</h2>
          <p className="text-gray-600 mb-6 text-lg">Join thousands of farmers who have improved their yields with our premium products</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" className="bg-foliage hover:bg-foliage-dark text-white px-8 py-6 text-lg shadow-lg">
              Shop Now <ShoppingCart className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
