import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tractor, Shovel, Forklift, Search, Filter, Calendar, MapPin, Star, Clock, Zap, Shield, Award, Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/LanguageContext";

type MachineryItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  dailyRentalPrice: number;
  purchasePrice: number;
  availability: "available" | "limited" | "unavailable";
  image: string;
  icon: React.ReactNode;
  rating: number;
  reviews: number;
  location: string;
  features: string[];
  specifications: {
    power?: string;
    capacity?: string;
    fuel?: string;
    year?: string;
  };
};

type ComboOffer = {
  id: string;
  name: string;
  description: string;
  machinery: string;
  laborTeamSize: number;
  dailyPrice: number;
  duration: string;
  savings: string;
  image: string;
};

const machineryItems: MachineryItem[] = [
  {
    id: "tractor-medium",
    name: "Medium Duty Tractor",
    category: "Plowing & Tilling",
    description: "45HP tractor suitable for medium-sized farms, efficient for plowing and field preparation",
    dailyRentalPrice: 89,
    purchasePrice: 14999,
    availability: "available",
    image: "https://images.unsplash.com/photo-1669465006373-e8cc2ce98921?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWVkaXVtJTIwRHV0eSUyMFRyYWN0b3IlMjBIYXZpbmclMjA0NUhQJTIwdHJhY3RvciUyMHN1aXRhYmxlJTIwZm9yJTIwbWVkaXVtJTIwc2l6ZWQlMjBmYXJtcyUyQyUyMGVmZmljaWVudCUyMGZvciUyMHBsb3dpbmclMjBhbmQlMjBmaWVsZCUyMHByZXBhcmF0aW9uR1BTfGVufDB8fDB8fHww",
    icon: <Tractor className="h-6 w-6" />,
    rating: 4.5,
    reviews: 127,
    location: "Delhi, India",
    features: ["GPS Navigation", "Air Conditioning", "Power Steering", "Hydraulic Lift"],
    specifications: {
      power: "45 HP",
      fuel: "Diesel",
      year: "2023",
      capacity: "Medium Load"
    }
  },
  {
    id: "harvester-basic",
    name: "Basic Harvester",
    category: "Harvesting",
    description: "Efficient grain harvester for wheat, corn and rice crops with 3.5m cutting width",
    dailyRentalPrice: 135,
    purchasePrice: 27500,
    availability: "limited",
    image: "https://media.istockphoto.com/id/2174926162/photo/combine-harvester-working-on-a-wheat-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=zsIfEHAfSkEXoGHGjDj2LbHc0bOvPkyAriP0zpctE4A=",
    icon: <Forklift className="h-6 w-6" />,
    rating: 4.8,
    reviews: 89,
    location: "Punjab, India",
    features: ["Grain Tank", "Cutting Platform", "Threshing Drum", "Cleaning System"],
    specifications: {
      power: "120 HP",
      capacity: "3.5m Cutting Width",
      fuel: "Diesel",
      year: "2023"
    }
  },
  {
    id: "seeder-precision",
    name: "Precision Seeder",
    category: "Planting",
    description: "High-precision seeding machine with adjustable row spacing and depth control",
    dailyRentalPrice: 75,
    purchasePrice: 8700,
    availability: "available",
    image: "data:image/jpeg;base64,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",
    icon: <Shovel className="h-6 w-6" />,
    rating: 4.3,
    reviews: 156,
    location: "Haryana, India",
    features: ["Variable Rate Seeding", "Depth Control", "Row Spacing Adjustment", "Seed Monitor"],
    specifications: {
      power: "30 HP Required",
      capacity: "8 Rows",
      fuel: "Tractor Powered",
      year: "2023"
    }
  },
  {
    id: "sprayer-large",
    name: "Large Field Sprayer",
    category: "Crop Protection",
    description: "18-meter boom sprayer for efficient application of fertilizers and pesticides",
    dailyRentalPrice: 110,
    purchasePrice: 12300,
    availability: "unavailable",
    image: "https://images.unsplash.com/photo-1587093611025-cfd7c1a58d18?q=80&w=2942&auto=format&fit=crop",
    icon: <Tractor className="h-6 w-6" />,
    rating: 4.6,
    reviews: 73,
    location: "Maharashtra, India",
    features: ["18m Boom Width", "GPS Guidance", "Variable Rate Application", "Tank Capacity 1000L"],
    specifications: {
      power: "80 HP",
      capacity: "1000L Tank",
      fuel: "Diesel",
      year: "2022"
    }
  },
];

const comboOffers: ComboOffer[] = [
  {
    id: "harvest-combo",
    name: "Complete Harvest Package",
    description: "Harvester with experienced 3-person labor team for efficient crop harvesting",
    machinery: "Basic Harvester",
    laborTeamSize: 3,
    dailyPrice: 220,
    duration: "3-7 days",
    savings: "Save 25% versus separate rental",
    image: "https://images.unsplash.com/photo-1593275410252-bb58bd53d958?q=80&w=2924&auto=format&fit=crop"
  },
  {
    id: "planting-combo",
    name: "Spring Planting Solution",
    description: "Precision seeder with 2-person trained team for optimal seed placement",
    machinery: "Precision Seeder",
    laborTeamSize: 2,
    dailyPrice: 165,
    duration: "2-5 days",
    savings: "Save 20% versus separate rental",
    image: "https://images.unsplash.com/photo-1589321402858-e29ae281b82e?q=80&w=2833&auto=format&fit=crop"
  },
  {
    id: "field-prep-combo",
    name: "Field Preparation Package",
    description: "Medium duty tractor with experienced operator for field preparation",
    machinery: "Medium Duty Tractor",
    laborTeamSize: 1,
    dailyPrice: 145,
    duration: "1-4 days",
    savings: "Save 15% versus separate rental",
    image: "https://images.unsplash.com/photo-1605488686053-8042e08db305?q=80&w=2940&auto=format&fit=crop"
  }
];

export default function Machinery() {
  const { t } = useLanguage();
  const [currentTab, setCurrentTab] = useState<string>("rental");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleBooking = (item: string, type: "rental" | "purchase" | "combo") => {
    toast({
      title: "🎉 Booking Initiated",
      description: `Your ${type} request for ${item} has been received. We'll contact you shortly with details.`,
    });
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredMachinery = machineryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...Array.from(new Set(machineryItems.map(item => item.category)))];

  const getAvailabilityBadge = (availability: MachineryItem["availability"]) => {
    switch(availability) {
      case "available":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 animate-pulse-soft">✅ Available Now</Badge>;
      case "limited":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 animate-bounce-gentle">⚠️ Limited Stock</Badge>;
      case "unavailable":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">❌ Currently Unavailable</Badge>;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <Layout>
        <WeatherWidget />
        <main className="container mx-auto px-4 pb-10">
          <div className="max-w-5xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-96 bg-gray-300 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <WeatherWidget />
      
      <main className="container mx-auto px-4 pb-10">
        {/* Hero Section with Enhanced Animation */}
        <div className="max-w-6xl mx-auto text-center mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-blue-50 to-yellow-50 opacity-30 animate-pulse-soft"></div>
          <div className="relative z-10 py-12">
            <div className="animate-bounce-gentle mb-4">
              <Tractor className="h-16 w-16 mx-auto text-green-600 animate-float" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-yellow-600 bg-clip-text text-transparent mb-4 animate-pulse-soft">
              {t('machinery-title')}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-6">
              {t('machinery-description')}
            </p>
            <div className="flex items-center justify-center gap-2 text-lg text-amber-600 font-semibold animate-bounce-gentle">
              <Zap className="h-5 w-5" />
              <span>New: AI-Powered Equipment Matching & Combo Packages!</span>
              <Zap className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search machinery, features, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-green-500 transition-colors"
              />
            </div>
            <div className="flex gap-4 items-center">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 h-12 border-2 border-gray-200 focus:border-green-500">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-10 w-10"
                >
                  <div className="grid grid-cols-2 gap-1 h-4 w-4">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-10 w-10"
                >
                  <div className="space-y-1 h-4 w-4">
                    <div className="bg-current h-1 rounded"></div>
                    <div className="bg-current h-1 rounded"></div>
                    <div className="bg-current h-1 rounded"></div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="rental" onValueChange={setCurrentTab} value={currentTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 w-full md:w-auto mx-auto bg-gradient-to-r from-green-100 to-blue-100 p-2 rounded-xl shadow-lg">
              <TabsTrigger 
                value="rental" 
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-semibold transition-all duration-300 hover:scale-105"
              >
                🏠 Rental Equipment
              </TabsTrigger>
              <TabsTrigger 
                value="purchase" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white font-semibold transition-all duration-300 hover:scale-105"
              >
                💰 Purchase Options
              </TabsTrigger>
              <TabsTrigger 
                value="combo" 
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white font-semibold transition-all duration-300 hover:scale-105"
              >
                🤝 Combo Packages
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="rental" className="mt-6">
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredMachinery.map((item, index) => (
                  <Card 
                    key={item.id} 
                    className={`group overflow-hidden border-2 border-transparent hover:border-green-400 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fade-in ${viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-1/3' : 'h-64'}`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" 
                      />
                      
                      {/* Floating Action Buttons */}
                      <div className="absolute top-4 right-4 z-20 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          onClick={() => toggleFavorite(item.id)}
                        >
                          <Heart className={`h-4 w-4 ${favorites.includes(item.id) ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                              <Eye className="h-4 w-4 text-gray-700" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {item.icon} {item.name}
                              </DialogTitle>
                              <DialogDescription className="text-lg">
                                {item.description}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <h4 className="font-semibold mb-2">Features:</h4>
                                <ul className="space-y-1">
                                  {item.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                      <Zap className="h-3 w-3 text-green-500" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Specifications:</h4>
                                <div className="space-y-1 text-sm">
                                  {Object.entries(item.specifications).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                      <span className="capitalize">{key}:</span>
                                      <span className="font-medium">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {/* Header Info */}
                      <div className="absolute bottom-4 left-4 z-20 text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-2 bg-green-500 rounded-full shadow-lg animate-pulse-soft">
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{item.name}</h3>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3" />
                              <span>{item.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`flex flex-col ${viewMode === 'list' ? 'w-2/3' : 'flex-1'}`}>
                      <CardContent className="pt-4 flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 font-semibold">
                            {item.category}
                          </Badge>
                          {getAvailabilityBadge(item.availability)}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            {renderStars(item.rating)}
                          </div>
                          <span className="text-sm font-medium">{item.rating}</span>
                          <span className="text-xs text-gray-500">({item.reviews} reviews)</span>
                        </div>

                        <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                        {/* Key Features */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.features.slice(0, 3).map((feature, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {item.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.features.length - 3} more
                            </Badge>
                          )}
                        </div>

                        {/* Pricing */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-green-600">
                              ₹{item.dailyRentalPrice}
                            </span>
                            <span className="text-gray-500">/day</span>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Quick Delivery
                          </Badge>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <div className="flex gap-2 w-full">
                          <Button 
                            variant="outline" 
                            className="flex-1 hover:bg-green-500 hover:text-white transition-all duration-300"
                            disabled={item.availability === "unavailable"}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Quick Quote
                          </Button>
                          <Button 
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:scale-105"
                            disabled={item.availability === "unavailable"}
                            onClick={() => handleBooking(item.name, "rental")}
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Book Now
                          </Button>
                        </div>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
              
              {filteredMachinery.length === 0 && (
                <div className="text-center py-12">
                  <Tractor className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No machinery found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="purchase" className="mt-6">
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 shadow-lg animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500 rounded-full">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800">Purchase Benefits</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>4-Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span>Free Training Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span>Bulk Discounts Available</span>
                  </div>
                </div>
              </div>

              <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredMachinery.map((item, index) => (
                  <Card 
                    key={item.id} 
                    className={`group overflow-hidden border-2 border-transparent hover:border-blue-400 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fade-in ${viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-1/3' : 'h-64'}`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" 
                      />
                      
                      <div className="absolute top-4 right-4 z-20 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          onClick={() => toggleFavorite(item.id)}
                        >
                          <Heart className={`h-4 w-4 ${favorites.includes(item.id) ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
                        </Button>
                        {item.availability !== "unavailable" && (
                          <Badge className="bg-green-500 text-white animate-pulse-soft">
                            💰 In Stock
                          </Badge>
                        )}
                      </div>

                      <div className="absolute bottom-4 left-4 z-20 text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-2 bg-blue-500 rounded-full shadow-lg animate-pulse-soft">
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{item.name}</h3>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3" />
                              <span>{item.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`flex flex-col ${viewMode === 'list' ? 'w-2/3' : 'flex-1'}`}>
                      <CardContent className="pt-4 flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-semibold">
                            {item.category}
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-800">
                            🏆 Premium Quality
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            {renderStars(item.rating)}
                          </div>
                          <span className="text-sm font-medium">{item.rating}</span>
                          <span className="text-xs text-gray-500">({item.reviews} reviews)</span>
                        </div>

                        <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.features.slice(0, 2).map((feature, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              <Zap className="h-3 w-3 mr-1" />
                              {feature}
                            </Badge>
                          ))}
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-blue-600">
                                ₹{item.purchasePrice.toLocaleString()}
                              </span>
                              <p className="text-xs text-gray-600">Financing available from ₹{Math.round(item.purchasePrice/24).toLocaleString()}/month</p>
                            </div>
                            <Badge className="bg-green-500 text-white">
                              💳 EMI Options
                            </Badge>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <div className="flex gap-2 w-full">
                          <Button 
                            variant="outline" 
                            className="flex-1 hover:bg-blue-500 hover:text-white transition-all duration-300"
                            disabled={item.availability === "unavailable"}
                          >
                            📞 Call Now
                          </Button>
                          <Button 
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 hover:scale-105"
                            disabled={item.availability === "unavailable"}
                            onClick={() => handleBooking(item.name, "purchase")}
                          >
                            💰 Get Quote
                          </Button>
                        </div>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200 shadow-lg animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500 rounded-full">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800">{t('financing-options')}</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  🏦 We offer flexible financing solutions for machinery purchases. Get instant approvals and competitive rates.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-white rounded-lg shadow">
                    <div className="text-2xl font-bold text-green-600">7.5%</div>
                    <div className="text-sm text-gray-600">Starting Interest Rate</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow">
                    <div className="text-2xl font-bold text-blue-600">84</div>
                    <div className="text-sm text-gray-600">Months Max Tenure</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow">
                    <div className="text-2xl font-bold text-purple-600">₹50L</div>
                    <div className="text-sm text-gray-600">Maximum Loan Amount</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link to="/loans" className="flex-1">
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                      <Zap className="h-4 w-4 mr-2" />
                      {t('explore-financing')}
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex-1 hover:bg-blue-500 hover:text-white">
                    📱 WhatsApp Support
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="combo" className="mt-6">
              <div className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 shadow-lg animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-500 rounded-full animate-bounce-gentle">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-800">{t('combo-packages')}</h3>
                  <Badge className="bg-green-500 text-white animate-pulse-soft">🔥 Best Value</Badge>
                </div>
                <p className="text-gray-700 mb-4">
                  🚜 Get equipment + skilled operators in one package. Save up to 30% compared to separate rentals!
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Verified & Insured Operators</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span>All-in-One Solution</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow">
                    <Award className="h-4 w-4 text-yellow-600" />
                    <span>Maximum Productivity</span>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comboOffers.map((combo, index) => (
                  <Card 
                    key={combo.id} 
                    className="group overflow-hidden border-2 border-transparent hover:border-yellow-400 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="h-56 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                      <img 
                        src={combo.image} 
                        alt={combo.name} 
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" 
                      />
                      
                      {/* Savings Badge */}
                      <div className="absolute top-4 right-4 z-20">
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold animate-pulse-soft shadow-lg">
                          💰 {combo.savings}
                        </Badge>
                      </div>

                      {/* Popular Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold animate-bounce-gentle">
                          ⭐ Popular
                        </Badge>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 z-20 text-white">
                        <h3 className="text-xl font-bold mb-1">{combo.name}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge className="bg-white/20 text-white text-xs">
                            🚜 {combo.machinery}
                          </Badge>
                          <Badge className="bg-white/20 text-white text-xs">
                            👥 {combo.laborTeamSize} Workers
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <CardContent className="pt-4">
                      <p className="text-gray-600 mb-3 line-clamp-2">{combo.description}</p>
                      
                      {/* Features */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Zap className="h-3 w-3 text-green-500" />
                          <span>Includes operator and helpers</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="h-3 w-3 text-blue-500" />
                          <span>Fixed daily rate for entire combo</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="h-3 w-3 text-yellow-500" />
                          <span>Crop-specific assistance included</span>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-2xl font-bold text-yellow-600">
                              ₹{combo.dailyPrice}
                            </span>
                            <span className="text-gray-500">/day</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Duration:</div>
                            <div className="text-sm font-medium">{combo.duration}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0">
                      <div className="flex gap-2 w-full">
                        <Button 
                          variant="outline" 
                          className="flex-1 hover:bg-yellow-500 hover:text-white transition-all duration-300"
                        >
                          📞 Call Expert
                        </Button>
                        <Button 
                          className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white transition-all duration-300 hover:scale-105"
                          onClick={() => handleBooking(combo.name, "combo")}
                        >
                          🤝 Book Combo
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {/* Custom Combo Section */}
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 shadow-lg animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500 rounded-full">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-800">{t('custom-combo')}</h3>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse-soft">
                    ⚡ New
                  </Badge>
                </div>
                <p className="text-gray-700 mb-4">
                  🎯 Need a specific machinery and labor combination? Our AI-powered matching system creates custom packages tailored to your exact farming needs and budget.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-600" />
                      What We Offer:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Custom machinery selection</li>
                      <li>• Specialized operator teams</li>
                      <li>• Flexible scheduling</li>
                      <li>• Competitive pricing</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      Process:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Share your requirements</li>
                      <li>• Get instant AI recommendations</li>
                      <li>• Review & customize package</li>
                      <li>• Book & get started</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link to="/contact" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      <Zap className="h-4 w-4 mr-2" />
                      {t('request-custom')}
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex-1 hover:bg-purple-500 hover:text-white">
                    🤖 AI Assistant
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </Layout>
  );
}
