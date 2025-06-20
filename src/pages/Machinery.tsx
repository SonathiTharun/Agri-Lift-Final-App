import { useState } from "react";
import { Layout } from "@/components/Layout";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tractor, Shovel, Forklift } from "lucide-react";
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
    image: "https://images.unsplash.com/photo-1605488686053-8042e08db305?q=80&w=2940&auto=format&fit=crop",
    icon: <Tractor className="h-6 w-6" />
  },
  {
    id: "harvester-basic",
    name: "Basic Harvester",
    category: "Harvesting",
    description: "Efficient grain harvester for wheat, corn and rice crops with 3.5m cutting width",
    dailyRentalPrice: 135,
    purchasePrice: 27500,
    availability: "limited",
    image: "https://images.unsplash.com/photo-1593275410252-bb58bd53d958?q=80&w=2924&auto=format&fit=crop",
    icon: <Forklift className="h-6 w-6" />
  },
  {
    id: "seeder-precision",
    name: "Precision Seeder",
    category: "Planting",
    description: "High-precision seeding machine with adjustable row spacing and depth control",
    dailyRentalPrice: 75,
    purchasePrice: 8700,
    availability: "available",
    image: "https://images.unsplash.com/photo-1589321402858-e29ae281b82e?q=80&w=2833&auto=format&fit=crop",
    icon: <Shovel className="h-6 w-6" />
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
    icon: <Tractor className="h-6 w-6" />
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
  
  const handleBooking = (item: string, type: "rental" | "purchase" | "combo") => {
    toast({
      title: "Booking Initiated",
      description: `Your ${type} request for ${item} has been received. We'll contact you shortly.`,
    });
  };

  const getAvailabilityBadge = (availability: MachineryItem["availability"]) => {
    switch(availability) {
      case "available":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t('available-now')}</Badge>;
      case "limited":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{t('limited-availability')}</Badge>;
      case "unavailable":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{t('currently-unavailable')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <WeatherWidget />
      
      <main className="container mx-auto px-4 pb-10">
        <div className="max-w-5xl mx-auto text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-soil-dark mb-2">{t('machinery-title')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('machinery-description')}<br />
            <span className="block text-amber-600 mt-2 font-medium">New: View combo packages with operator + machinery for optimized harvest!</span>
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="rental" onValueChange={setCurrentTab} value={currentTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 w-full md:w-auto">
              <TabsTrigger value="rental">{t('rental-equipment')}</TabsTrigger>
              <TabsTrigger value="purchase">{t('purchase-options')}</TabsTrigger>
              <TabsTrigger value="combo">{t('machine-labor-combos')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rental" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {machineryItems.map(item => (
                  <Card key={item.id} className="overflow-hidden border-2 border-transparent hover:border-foliage transition-all duration-300">
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover object-center" 
                      />
                      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white">
                        <div className="p-2 bg-foliage rounded-full">{item.icon}</div>
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="bg-foliage-light/30 text-foliage-dark">
                          {item.category}
                        </Badge>
                        {getAvailabilityBadge(item.availability)}
                      </div>
                      <p className="text-gray-600 mt-2"><span className="font-medium">{item.name}</span>: {item.description}</p>
                      <ul className="text-xs text-gray-500 mt-1 list-disc pl-5">
                        <li>Daily maintenance included in rental.</li>
                        <li>On-site support in case of breakdowns.</li>
                        <li>Discounts for rentals &gt; 3 days!</li>
                      </ul>
                      <p className="text-lg font-semibold text-foliage-dark mt-3">
                        ${item.dailyRentalPrice}/day
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full hover:bg-foliage hover:text-white"
                        disabled={item.availability === "unavailable"}
                        onClick={() => handleBooking(item.name, "rental")}
                      >
                        {t('book-rental')}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="purchase" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {machineryItems.map(item => (
                  <Card key={item.id} className="overflow-hidden border-2 border-transparent hover:border-foliage transition-all duration-300">
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover object-center" 
                      />
                      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white">
                        <div className="p-2 bg-foliage rounded-full">{item.icon}</div>
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="bg-foliage-light/30 text-foliage-dark">
                          {item.category}
                        </Badge>
                        {item.availability !== "unavailable" && (
                          <Badge variant="outline" className="bg-sky-light/30 text-sky-dark border-sky-200">
                            In Stock
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mt-2"><span className="font-medium">{item.name}</span>: {item.description}</p>
                      <ul className="text-xs text-gray-500 mt-1 list-disc pl-5">
                        <li>Warranty up to 4 years for all equipment.</li>
                        <li>Free training for first-time buyers.</li>
                        <li>Bulk purchase discount available.</li>
                      </ul>
                      <p className="text-lg font-semibold text-foliage-dark mt-3">
                        ${item.purchasePrice.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Financing options available
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full hover:bg-foliage hover:text-white"
                        disabled={item.availability === "unavailable"}
                        onClick={() => handleBooking(item.name, "purchase")}
                      >
                        {t('purchase-inquiry')}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-foliage-light/20 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{t('financing-options')}</h3>
                <p className="text-gray-700">
                  We offer flexible financing solutions for machinery purchases. Visit our loans page or contact us for more information.
                </p>
                <div className="mt-4">
                  <Link to="/loans">
                    <Button variant="default" className="bg-foliage hover:bg-foliage-dark">
                      {t('explore-financing')}
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="combo" className="mt-6">
              <div className="mb-6 p-6 bg-wheat-light rounded-lg border border-wheat">
                <h3 className="text-xl font-semibold text-soil-dark mb-2">{t('combo-packages')}</h3>
                <p className="text-gray-700">
                  Get the equipment you need along with skilled operators to maximize productivity. These packages offer significant savings compared to separate rentals.<br />
                  <span className="text-green-600 font-medium">Operator background verified and insured for all combo packages.</span>
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {comboOffers.map(combo => (
                  <Card key={combo.id} className="overflow-hidden border-2 border-wheat hover:border-foliage transition-all duration-300">
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <img 
                        src={combo.image} 
                        alt={combo.name} 
                        className="w-full h-full object-cover object-center" 
                      />
                      <div className="absolute top-4 right-4 z-20">
                        <Badge className="bg-wheat-dark text-white">
                          {combo.savings}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 z-20 text-white">
                        <h3 className="text-xl font-semibold">{combo.name}</h3>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-sky-light/30 text-sky-dark">
                          {combo.machinery}
                        </Badge>
                        <Badge variant="outline" className="border-foliage text-foliage">
                          +{combo.laborTeamSize} Workers
                        </Badge>
                      </div>
                      <p className="text-gray-600 mt-2">{combo.description}</p>
                      <ul className="text-xs text-gray-500 mt-1 list-disc pl-5">
                        <li>Includes operator and helpers as per package.</li>
                        <li>Fixed daily rate for the entire combo.</li>
                        <li>Assistance for crop-specific needs (on request).</li>
                      </ul>
                      <div className="mt-3 flex justify-between items-center">
                        <p className="text-lg font-semibold text-foliage-dark">
                          ${combo.dailyPrice}/day
                        </p>
                        <span className="text-sm text-gray-500">
                          Typical duration: {combo.duration}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full hover:bg-foliage hover:text-white"
                        onClick={() => handleBooking(combo.name, "combo")}
                      >
                        {t('book-combo')}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-foliage-light/20 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{t('custom-combo')}</h3>
                <p className="text-gray-700">
                  Need a specific machinery and labor combination? Contact us to create a custom package tailored to your farming needs.
                </p>
                <div className="mt-4">
                  <Link to="/contact">
                    <Button variant="default" className="bg-foliage hover:bg-foliage-dark">
                      {t('request-custom')}
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </Layout>
  );
}
