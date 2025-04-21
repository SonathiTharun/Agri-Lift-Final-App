import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Flask, Seedling, ClipboardList, Robot, Globe, Leaf, Utensils } from "lucide-react";

const Services = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("farming");

  const stats = [
    { value: "10K+", label: "Farmers Served" },
    { value: "25+", label: "Seed Varieties" },
    { value: "95%", label: "Success Rate" },
    { value: "24/7", label: "Expert Support" },
  ];

  const farmingServices = [
    {
      icon: <Flask className="h-6 w-6" />,
      title: "Soil Testing & Analysis",
      description: "Comprehensive soil health assessment with AI-powered recommendations",
      features: [
        "Nutrient level analysis with detailed reports",
        "Crop suitability assessment for your soil type",
        "Custom fertilizer recommendations"
      ],
      badge: "Popular"
    },
    {
      icon: <Seedling className="h-6 w-6" />,
      title: "Premium Seed Supply",
      description: "Certified seeds with guaranteed germination rates",
      stats: [
        { label: "Varieties", value: "25+" },
        { label: "Germination", value: "98%" },
        { label: "Climate", value: "Adaptive" },
        { label: "Options", value: "Organic" }
      ]
    },
    {
      icon: <ClipboardList className="h-6 w-6" />,
      title: "Crop Advisory Services",
      description: "Expert guidance through the entire crop lifecycle",
      features: [
        "Seasonal planning & crop rotation advice",
        "Disease & pest management guidance",
        "Harvest optimization techniques"
      ]
    }
  ];

  const advancedServices = [
    {
      icon: <Robot className="h-6 w-6" />,
      title: "Smart Farming Solutions",
      description: "IoT-enabled farming systems for precision agriculture",
      badge: "Advanced"
    },
  ];

  const specializedServices = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Export Support",
      description: "End-to-end export assistance for international markets"
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Organic Certification",
      description: "Complete assistance with organic certification process",
      badge: "Eco-Friendly"
    },
    {
      icon: <Utensils className="h-6 w-6" />,
      title: "Farm-to-Table Network",
      description: "Direct connections with restaurants and retail chains"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-soil-light/10 to-foliage-light/10">
      <Navbar />
      
      <main className="container mx-auto pt-28 px-4 pb-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100 p-8 mb-16">
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4 animate-fade-in">
              {t("services-title")}
            </h1>
            <p className="text-lg text-emerald-700 max-w-2xl mx-auto mb-8 animate-fade-in">
              {t("services-description")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Services
              </Button>
              <Button size="lg" variant="outline">
                Get Started
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center">
              <h3 className="text-3xl font-bold text-emerald-600 mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Services Tabs */}
        <div id="services" className="mb-16">
          <Tabs defaultValue="farming" className="w-full">
            <TabsList className="w-full justify-center mb-8">
              <TabsTrigger value="farming">Farming Essentials</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Solutions</TabsTrigger>
              <TabsTrigger value="specialized">Specialized Services</TabsTrigger>
            </TabsList>

            <TabsContent value="farming" className="mt-0">
              <div className="grid md:grid-cols-3 gap-6">
                {farmingServices.map((service, index) => (
                  <Card key={index} className="relative overflow-hidden">
                    <div className="p-6">
                      {service.badge && (
                        <Badge className="absolute top-4 right-4">{service.badge}</Badge>
                      )}
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-6 text-emerald-600">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      
                      {service.features && (
                        <ul className="space-y-2 mb-6">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <span className="text-emerald-500 mr-2">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}

                      {service.stats && (
                        <div className="grid grid-cols-2 gap-2 mb-6">
                          {service.stats.map((stat, idx) => (
                            <div key={idx} className="bg-emerald-50 p-2 rounded-lg text-center">
                              <div className="font-semibold text-emerald-700">{stat.value}</div>
                              <div className="text-xs text-gray-600">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button variant="outline" className="w-full">Learn More</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="mt-0">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Advanced services content */}
              </div>
            </TabsContent>

            <TabsContent value="specialized" className="mt-0">
              <div className="grid md:grid-cols-3 gap-6">
                {specializedServices.map((service, index) => (
                  <Card key={index} className="relative overflow-hidden">
                    <div className="p-6">
                      {service.badge && (
                        <Badge className="absolute top-4 right-4">{service.badge}</Badge>
                      )}
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-6 text-emerald-600">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <Button variant="outline" className="w-full">Learn More</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Services;
