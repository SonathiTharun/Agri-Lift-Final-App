
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/components/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, Globe, Package, ShoppingBag, Store, Truck } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Export = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedBuyers, setSelectedBuyers] = useState<string[]>([]);
  const [cropDetails, setCropDetails] = useState({
    name: '',
    quantity: '',
    price: '',
    description: '',
    certification: '',
    harvestDate: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCropDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBuyerSelection = (buyerId: string) => {
    setSelectedBuyers(prev => 
      prev.includes(buyerId)
        ? prev.filter(id => id !== buyerId)
        : [...prev, buyerId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropDetails.name || !cropDetails.quantity || !cropDetails.price) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedBuyers.length === 0) {
      toast({
        title: "No buyers selected",
        description: "Please select at least one buyer",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Export listing created!",
      description: `Your ${cropDetails.name} has been listed for export to ${selectedBuyers.length} buyer(s)`,
      action: (
        <Button variant="outline" size="sm" onClick={() => console.log("View listing")}>
          View
        </Button>
      ),
    });

    // Reset form
    setCropDetails({
      name: '',
      quantity: '',
      price: '',
      description: '',
      certification: '',
      harvestDate: '',
    });
    setSelectedBuyers([]);
  };

  const internationalBuyers = [
    { id: 'uae', name: 'UAE Food Importers', flag: '🇦🇪', markets: ['Organic Foods', 'Premium Fruits'] },
    { id: 'usa', name: 'US Agri Trade', flag: '🇺🇸', markets: ['Specialty Grains', 'Organic Certification Required'] },
    { id: 'eu', name: 'European Fresh Markets', flag: '🇪🇺', markets: ['Premium Quality', 'Sustainable Farming'] },
    { id: 'brazil', name: 'Brazilian Importers', flag: '🇧🇷', markets: ['Tropical Fruits', 'Spices'] },
  ];

  const localBuyers = [
    { id: 'jiomart', name: 'JioMart', logo: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&auto=format&fit=crop', type: 'Supermarket Chain' },
    { id: 'dmart', name: 'DMart', logo: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=800&auto=format&fit=crop', type: 'Wholesale Retailer' },
    { id: 'bigbasket', name: 'BigBasket', logo: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&auto=format&fit=crop', type: 'Online Grocery' },
  ];

  const onlinePlatforms = [
    { id: 'amazon', name: 'Amazon', logo: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop', commission: '8-15%' },
    { id: 'flipkart', name: 'Flipkart', logo: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=800&auto=format&fit=crop', commission: '5-12%' },
    { id: 'instamart', name: 'Swiggy Instamart', logo: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&auto=format&fit=crop', commission: '10-18%' },
    { id: 'blinkit', name: 'Blinkit', logo: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=800&auto=format&fit=crop', commission: '12-15%' },
    { id: 'zepto', name: 'Zepto', logo: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&auto=format&fit=crop', commission: '10-15%' },
  ];

  const agriLiftServices = [
    { id: 'branding', title: 'AgriLift Branding', description: 'Sell under our premium brand with packaging and marketing support' },
    { id: 'quality', title: 'Quality Assurance', description: 'Our experts test and certify your produce for export standards' },
    { id: 'logistics', title: 'Export Logistics', description: 'End-to-end handling of documentation, shipping, and customs' },
    { id: 'pricing', title: 'Price Optimization', description: 'AI-driven pricing models to maximize your profits' },
  ];

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="flex flex-col space-y-5">
          <div>
            <h1 className="text-3xl font-bold text-foliage-dark">{t('export-management')}</h1>
            <p className="text-muted-foreground mt-2">{t('export-description')}</p>
          </div>

          <Alert className="bg-foliage-light/20 border-foliage">
            <Package className="h-4 w-4 text-foliage" />
            <AlertTitle>{t('agrilift-export-program')}</AlertTitle>
            <AlertDescription>
              {t('export-program-desc')}
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="listing" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="listing">{t('create-listing')}</TabsTrigger>
              <TabsTrigger value="buyers">{t('find-buyers')}</TabsTrigger>
              <TabsTrigger value="services">{t('export-services')}</TabsTrigger>
              <TabsTrigger value="dashboard">{t('my-exports')}</TabsTrigger>
            </TabsList>

            <TabsContent value="listing" className="space-y-4 bg-white p-6 rounded-lg border">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">{t('list-your-produce')}</h2>
                <p className="text-muted-foreground">{t('create-listing-desc')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">Crop Name*</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={cropDetails.name} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Organic Wheat" 
                        required 
                      />
                    </div>

                    <div>
                      <Label htmlFor="quantity">Available Quantity (kg)*</Label>
                      <Input 
                        id="quantity" 
                        name="quantity" 
                        value={cropDetails.quantity} 
                        onChange={handleInputChange} 
                        placeholder="e.g. 5000" 
                        required 
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Price per kg (₹)*</Label>
                      <Input 
                        id="price" 
                        name="price" 
                        value={cropDetails.price} 
                        onChange={handleInputChange} 
                        placeholder="e.g. 25" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input 
                        id="description" 
                        name="description" 
                        value={cropDetails.description} 
                        onChange={handleInputChange} 
                        placeholder="Describe your produce" 
                      />
                    </div>

                    <div>
                      <Label htmlFor="certification">Certifications</Label>
                      <Input 
                        id="certification" 
                        name="certification" 
                        value={cropDetails.certification} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Organic, GAP Certified" 
                      />
                    </div>

                    <div>
                      <Label htmlFor="harvestDate">Harvest Date</Label>
                      <Input 
                        id="harvestDate" 
                        name="harvestDate" 
                        type="date" 
                        value={cropDetails.harvestDate} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Select Target Buyers</h3>
                  <div className="flex flex-wrap gap-2">
                    {[...internationalBuyers, ...localBuyers, ...onlinePlatforms].map(buyer => (
                      <Badge 
                        key={buyer.id} 
                        variant={selectedBuyers.includes(buyer.id) ? "default" : "outline"}
                        className={`cursor-pointer ${selectedBuyers.includes(buyer.id) ? 'bg-foliage text-white' : 'hover:bg-foliage/10'}`}
                        onClick={() => handleBuyerSelection(buyer.id)}
                      >
                        {buyer.name} {selectedBuyers.includes(buyer.id) && <Check className="ml-1 w-3 h-3" />}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto bg-foliage hover:bg-foliage-dark">
                  Create Export Listing
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="buyers" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">International Buyers</h2>
                <p className="text-muted-foreground mb-4">Connect with buyers from around the world</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {internationalBuyers.map(buyer => (
                    <Card key={buyer.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-2xl">{buyer.flag}</span> {buyer.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Markets:</p>
                          <ul className="text-sm list-disc pl-5">
                            {buyer.markets.map((market, i) => (
                              <li key={i}>{market}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          <Globe className="mr-2 h-4 w-4" />
                          Connect
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-2xl font-semibold">Local Buyers</h2>
                <p className="text-muted-foreground mb-4">Supermarkets and retail chains</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {localBuyers.map(buyer => (
                    <Card key={buyer.id}>
                      <CardHeader>
                        <div className="w-full h-32 relative overflow-hidden rounded-md">
                          <AspectRatio ratio={16 / 9}>
                            <img 
                              src={buyer.logo} 
                              alt={buyer.name} 
                              className="object-cover w-full h-full"
                            />
                          </AspectRatio>
                        </div>
                        <CardTitle className="mt-2">{buyer.name}</CardTitle>
                        <CardDescription>{buyer.type}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          <Store className="mr-2 h-4 w-4" />
                          Submit Proposal
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-2xl font-semibold">Online Platforms</h2>
                <p className="text-muted-foreground mb-4">E-commerce and quick commerce platforms</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {onlinePlatforms.map(platform => (
                    <Card key={platform.id}>
                      <CardHeader className="text-center pb-2">
                        <Avatar className="mx-auto h-16 w-16">
                          <AvatarImage src={platform.logo} alt={platform.name} />
                          <AvatarFallback>{platform.name[0]}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="mt-2 text-lg">{platform.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <Badge variant="secondary">Commission: {platform.commission}</Badge>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Sell On Platform
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">AgriLift Export Services</h2>
                <p className="text-muted-foreground mb-4">End-to-end support for farmers exporting produce</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {agriLiftServices.map(service => (
                    <Card key={service.id} className="flex flex-col h-full">
                      <CardHeader>
                        <CardTitle>{service.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p>{service.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="bg-foliage hover:bg-foliage-dark">Learn More</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="bg-foliage-light/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Export Compliance Assistance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-md shadow">
                    <h4 className="font-medium text-foliage-dark">Documentation</h4>
                    <p className="text-sm mt-2">We handle all export permits, phytosanitary certificates, and customs paperwork</p>
                  </div>
                  <div className="bg-white p-4 rounded-md shadow">
                    <h4 className="font-medium text-foliage-dark">Quality Standards</h4>
                    <p className="text-sm mt-2">Testing and certification to meet international food safety standards</p>
                  </div>
                  <div className="bg-white p-4 rounded-md shadow">
                    <h4 className="font-medium text-foliage-dark">Shipping Logistics</h4>
                    <p className="text-sm mt-2">Temperature-controlled transportation and container management</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dashboard">
              <div className="bg-white p-6 rounded-lg border space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">My Export Activities</h2>
                  <Button variant="outline">
                    <Package className="mr-2 h-4 w-4" />
                    New Listing
                  </Button>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-8 text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Active Export Listings</h3>
                    <p className="text-muted-foreground mb-4">Create your first export listing to connect with buyers worldwide</p>
                    <Button className="bg-foliage hover:bg-foliage-dark">Create Export Listing</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Export Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <span>International Market Guide</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>Packaging Standards</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          <span>Logistics Partners</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Market Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Access real-time market trends and export opportunities
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm">View Insights</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Schedule a Consultation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Speak with our export specialists for personalized guidance
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm">Book Now</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Export;
