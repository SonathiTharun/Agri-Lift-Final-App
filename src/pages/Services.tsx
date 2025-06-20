
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/components/LanguageContext";
import { Button } from "@/components/ui/button";
import { 
  Beaker, 
  Sprout, 
  ClipboardList, 
  Bot, 
  Plane, // Replaced 'Drone' with 'Plane'
  Droplet,
  Globe,
  Leaf,
  UtensilsCrossed 
} from "lucide-react";
import { useState } from "react";

const Services = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("farming");

  // Statistics data
  const stats = [
    { value: "10K+", label: t("farmers-served") },
    { value: "25+", label: t("seed-varieties") },
    { value: "95%", label: t("success-rate") },
    { value: "24/7", label: t("expert-support") },
  ];

  // Service cards data
  const farmingServices = [
    {
      icon: <Beaker className="w-8 h-8" />,
      title: "Soil Testing & Analysis",
      description: "Comprehensive soil health assessment with AI-powered recommendations",
      features: [
        "Nutrient level analysis with detailed reports",
        "Crop suitability assessment for your soil type",
        "Custom fertilizer recommendations for optimal yield"
      ],
      action: () => navigate("/dashboard"),
      badge: "Popular"
    },
    {
      icon: <Sprout className="w-8 h-8" />,
      title: "Premium Seed Supply",
      description: "Certified seeds with guaranteed germination rates for optimal crop yield",
      stats: [
        { label: "Varieties", value: "25+" },
        { label: "Germination", value: "98%" },
        { label: "Climate", value: "Adaptive" },
        { label: "Options", value: "Organic" }
      ],
      action: () => navigate("/market")
    },
    {
      icon: <ClipboardList className="w-8 h-8" />,
      title: "Crop Advisory Services",
      description: "Expert guidance through the entire crop lifecycle for maximum yield",
      features: [
        "Seasonal planning & crop rotation advice",
        "Disease & pest management guidance",
        "Harvest optimization techniques"
      ],
      action: () => navigate("/monitoring")
    }
  ];

  const advancedServices = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: "Smart Farming Solutions",
      description: "IoT-enabled farming systems for precision agriculture",
      features: [
        "Real-time monitoring of soil moisture & crop health",
        "Weather forecasting & automated irrigation",
        "Mobile app control & notifications"
      ],
      action: () => navigate("/monitoring"),
      badge: "Advanced"
    },
    {
      icon: <Plane className="w-8 h-8" />, // Changed from Drone to Plane
      title: "Drone Mapping & Analysis",
      description: "Aerial imaging and analysis for crop monitoring",
      features: [
        "Comprehensive aerial maps",
        "Early pest detection",
        "Growth analysis tracking"
      ],
      action: () => navigate("/monitoring"),
      badge: "Innovative"
    },
    {
      icon: <Droplet className="w-8 h-8" />,
      title: "Automated Irrigation",
      description: "Smart water management solutions",
      features: [
        "Water usage optimization",
        "Scheduled irrigation",
        "Weather-based adjustments"
      ],
      action: () => navigate("/monitoring")
    }
  ];

  const specializedServices = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Export Support",
      description: "End-to-end export assistance",
      features: [
        "Documentation support",
        "Logistics management",
        "Market access"
      ],
      action: () => navigate("/export")
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Organic Certification",
      description: "Complete organic certification assistance",
      features: [
        "USDA Organic",
        "EU Organic",
        "India Organic (NPOP)"
      ],
      action: () => navigate("/farming-type?type=organic"),
      badge: "Eco-Friendly"
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: "Farm-to-Table Network",
      description: "Direct connection with buyers",
      features: [
        "Restaurant partnerships",
        "Hotel supply chains",
        "Retail connections"
      ],
      action: () => navigate("/market")
    }
  ];

  const ServiceCard = ({ service }) => (
    <div className="service-card bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
      <div className="service-icon text-emerald-600 mb-6">
        {service.icon}
      </div>
      {service.badge && (
        <span className="badge bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {service.badge}
        </span>
      )}
      <h3 className="text-xl font-bold mb-3">{service.title}</h3>
      <p className="text-gray-600 mb-4">{service.description}</p>
      
      {service.features && (
        <ul className="space-y-2 mb-6">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm">
              <span className="text-emerald-600 mr-2">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {service.stats && (
        <div className="grid grid-cols-2 gap-2 mb-6">
          {service.stats.map((stat, index) => (
            <div key={index} className="bg-emerald-50 p-3 rounded-lg text-center">
              <div className="text-sm font-semibold text-emerald-700">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      <Button 
        onClick={service.action}
        className="w-full bg-emerald-600 hover:bg-emerald-700"
      >
        {t('get-started')}
      </Button>
    </div>
  );

  return (
    <Layout>
      <div className="bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-6">
              {t('agricultural-services')}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('services-description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('explore-services')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/farming-type")}
              >
                {t('choose-farming-type')}
              </Button>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Services Tabs */}
          <div id="services" className="mb-16">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {["farming", "advanced", "specialized"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "outline"}
                  onClick={() => setActiveTab(tab)}
                  className={activeTab === tab ? "bg-emerald-600" : ""}
                >
                  {t(`${tab}-services`)}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeTab === "farming" && farmingServices.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}
              {activeTab === "advanced" && advancedServices.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}
              {activeTab === "specialized" && specializedServices.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
