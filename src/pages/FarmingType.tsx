import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight, BarChart3, Book, Users, MessageCircle, Download, MapPin, Brain, Bot } from "lucide-react";

// AnimatedPrice component to show price fluctuation animation
const AnimatedPrice = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <motion.span
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.3 }}
      className="inline-block"
    >
      {displayValue}
    </motion.span>
  );
};

const FarmingType = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("dairy");
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Initialize with weather data
  const [weatherData, setWeatherData] = useState({
    temp: 28,
    humidity: 65,
    condition: "Sunny",
    forecast: [
      { day: "Today", temp: 28, condition: "Sunny" },
      { day: "Tomorrow", temp: 30, condition: "Partly Cloudy" },
      { day: "Saturday", temp: 27, condition: "Rain" },
      { day: "Sunday", temp: 26, condition: "Cloudy" },
    ],
  });

  // Mock market prices with dynamic behavior
  const [marketPrices, setMarketPrices] = useState({
    dairy: { milk: 40, butter: 280, cheese: 350 },
    poultry: { eggs: 6, chicken: 180 },
    marine: { rohu: 220, prawns: 450 },
    bee: { honey: 420 },
    organic: { vegetables: 120, fruits: 180 },
  });

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
  };

  // Simulate loading and market price fluctuations
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 800);

    const interval = setInterval(() => {
      setMarketPrices((prevPrices) => {
        const newPrices = { ...prevPrices };
        const categories = Object.keys(newPrices);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const products = Object.keys(newPrices[randomCategory]);
        const randomProduct = products[Math.floor(Math.random() * products.length)];

        const currentPrice = newPrices[randomCategory][randomProduct];
        const fluctuation = currentPrice * (Math.random() * 0.1 - 0.05);
        newPrices[randomCategory][randomProduct] = Math.round(currentPrice + fluctuation);

        return newPrices;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Content for each farming type
  const farmingTypes = {
    dairy: {
      title: "Dairy Farming",
      icon: "🐄",
      color: "emerald",
      description:
        "Access comprehensive resources for dairy farming, including breed information, nutrition guidelines, milking techniques, disease management, and marketing strategies.",
    },
    poultry: {
      title: "Poultry Farming",
      icon: "🐔",
      color: "amber",
      description:
        "Resources for poultry farming, including types of poultry farming, breed information, feed management, disease control, and market insights.",
    },
    marine: {
      title: "Marine Farming (Aquaculture)",
      icon: "🐟",
      color: "blue",
      description:
        "Resources for aquaculture, including fish and crustacean farming, pond setup, water quality management, and sustainable practices.",
    },
    bee: {
      title: "Bee Farming (Apiculture)",
      icon: "🐝",
      color: "yellow",
      description:
        "Resources for beekeeping, including bee types, hive management, honey extraction, and marketing of bee products.",
    },
    organic: {
      title: "Organic Farming",
      icon: "🌿",
      color: "green",
      description:
        "Resources for organic farming, including conversion processes, certification, natural fertilizers, pest management, and marketing organic produce.",
    },
  };

  // Cards for each farming type
  const dairyCards = [
    {
      title: "Breeds & Genetics",
      description: "Information about cow and buffalo breeds",
      items: [
        "Holstein-Friesian, Jersey, Sahiwal",
        "Murrah, Jaffarabadi, Mehsana buffalo",
        "Cross-breeding programs",
        "Genetic improvement techniques",
      ],
    },
    {
      title: "Feed & Nutrition",
      description: "Feed management and nutrition guides",
      items: [
        "Balanced feed formulations",
        "Fodder cultivation techniques",
        "Silage preparation",
        "Mineral supplements",
      ],
    },
    {
      title: "Milking & Equipment",
      description: "Milking techniques and equipment",
      items: [
        "Hand vs. machine milking",
        "Milking parlor setup",
        "Hygiene protocols",
        "Milk storage solutions",
      ],
    },
    {
      title: "Disease Management",
      description: "Prevention and treatment of common diseases",
      items: [
        "Mastitis prevention",
        "Vaccination schedules",
        "Foot and mouth disease control",
        "Parasite management",
      ],
    },
    {
      title: "Marketing & Storage",
      description: "Milk collection, storage, and marketing",
      items: [
        "Cooling and preservation methods",
        "Quality testing protocols",
        "Dairy cooperatives",
        "Direct marketing strategies",
      ],
    },
    {
      title: "Government Schemes",
      description: "Subsidies and support for dairy farmers",
      items: [
        "Dairy entrepreneurship development",
        "Loan schemes for dairy farming",
        "Insurance programs",
        "Training and skill development",
      ],
    },
  ];

  const poultryCards = [
    {
      title: "Broiler vs Layer",
      description: "Different types of poultry farming",
      items: [
        "Economic comparison",
        "Setup requirements",
        "Management differences",
        "Investment analysis",
      ],
    },
    {
      title: "Breed Selection",
      description: "Chicken breeds and their productivity",
      items: [
        "Commercial breeds (Leghorn, Rhode Island)",
        "Indigenous breeds (Kadaknath, Aseel)",
        "Hybrid varieties",
        "Selection criteria",
      ],
    },
    {
      title: "Feed Management",
      description: "Nutrition and feeding practices",
      items: [
        "Feed formulation by age",
        "Protein and energy requirements",
        "Feed supplements",
        "Water management",
      ],
    },
    {
      title: "Disease Control",
      description: "Vaccination and health management",
      items: [
        "Vaccination schedules",
        "Biosecurity measures",
        "Common disease identification",
        "Treatment protocols",
      ],
    },
    {
      title: "Processing & Marketing",
      description: "Egg and meat processing tips",
      items: [
        "Egg grading and storage",
        "Meat processing techniques",
        "Packaging standards",
        "Value-added products",
      ],
    },
    {
      title: "Market Updates",
      description: "Pricing trends and market information",
      items: [
        "Current egg and meat prices",
        "Seasonal demand patterns",
        "Market forecasts",
        "Export opportunities",
      ],
    },
  ];

  const marineCards = [
    {
      title: "Species Selection",
      description: "Types of fish and crustaceans",
      items: [
        "Freshwater fish (Rohu, Catla, Common Carp)",
        "Brackish water species (Sea Bass, Pearl Spot)",
        "Crustaceans (Shrimp, Prawns, Crabs)",
        "Ornamental fish",
      ],
    },
    {
      title: "Pond Setup",
      description: "Tank setup and water quality control",
      items: [
        "Pond construction guidelines",
        "Aeration systems",
        "Water filtration",
        "Stocking density",
      ],
    },
    {
      title: "Feed & Growth",
      description: "Feed and growth monitoring",
      items: [
        "Commercial feeds vs natural feeds",
        "Feeding schedules",
        "Growth monitoring techniques",
        "Feed conversion ratio",
      ],
    },
    {
      title: "Health Management",
      description: "Disease prevention and treatment",
      items: [
        "Common diseases identification",
        "Preventive measures",
        "Treatment protocols",
        "Water quality maintenance",
      ],
    },
    {
      title: "Licensing & Compliance",
      description: "Legal requirements and sustainability",
      items: [
        "License application process",
        "Environmental compliance",
        "Sustainable practices",
        "Quality certifications",
      ],
    },
    {
      title: "Market Insights",
      description: "Trends in seafood market",
      items: [
        "Price trends for various species",
        "Local and export markets",
        "Value-added products",
        "Cold chain logistics",
      ],
    },
  ];

  const beeCards = [
    {
      title: "Bee Types",
      description: "Types of bees and beekeeping techniques",
      items: [
        "European honey bee (Apis mellifera)",
        "Indian honey bee (Apis cerana)",
        "Stingless bees (Tetragonula)",
        "Queen rearing techniques",
      ],
    },
    {
      title: "Hive Management",
      description: "Hive setup and maintenance",
items: [
  "Langstroth, Top-bar and traditional hives",
  "Hive placement and orientation",
  "Colony inspection techniques",
  "Swarm prevention",
],
    },
    {
      title: "Honey Production",
      description: "Honey extraction and processing",
      items: [
        "Uncapping techniques",
        "Manual and electric extractors",
        "Filtering and bottling",
        "Quality testing",
      ],
    },
    {
      title: "By-Products",
      description: "Pollen and wax harvesting",
      items: [
        "Beeswax collection and processing",
        "Pollen trapping methods",
        "Royal jelly production",
        "Propolis collection",
      ],
    },
    {
      title: "Safety & Care",
      description: "Safety measures and seasonal care",
      items: [
        "Protective equipment",
        "Handling techniques",
        "Seasonal management",
        "Disease prevention",
      ],
    },
    {
      title: "Markets",
      description: "Markets for honey and by-products",
      items: [
        "Direct marketing strategies",
        "Wholesale channels",
        "Value-added products",
        "Organic certification",
      ],
    },
  ];

  const organicCards = [
    {
      title: "Organic vs Conventional",
      description: "Comparison of farming methods",
      items: [
        "Environmental impact comparison",
        "Health benefits analysis",
        "Yield differences",
        "Economic considerations",
      ],
    },
    {
      title: "Certification Process",
      description: "Steps to get organic certification",
      items: [
        "Conversion period requirements",
        "Documentation needed",
        "Inspection procedures",
        "Certification agencies",
      ],
    },
    {
      title: "Natural Solutions",
      description: "Organic fertilizers and pest control",
      items: [
        "Compost preparation",
        "Vermicomposting",
        "Biopesticides and natural repellents",
        "Biological control agents",
      ],
    },
    {
      title: "Farming Techniques",
      description: "Crop rotation and companion planting",
      items: [
        "Multi-year rotation plans",
        "Beneficial plant combinations",
        "Green manuring practices",
        "Intercropping strategies",
      ],
    },
    {
      title: "Market Connections",
      description: "Organic market linkages",
      items: [
        "Direct marketing channels",
        "Organic food retailers",
        "Export opportunities",
        "Community Supported Agriculture (CSA)",
      ],
    },
    {
      title: "Financial Analysis",
      description: "Cost and profit analysis",
      items: [
        "Conversion cost considerations",
        "Premium pricing strategies",
        "ROI calculations",
        "Subsidy programs",
      ],
    },
  ];

  // Resource cards for all farming types
  const resourceCards = [
    {
      title: "How-To Guides",
      description: "Step-by-step instructions",
      text: "Detailed guides on various farming operations with visual aids and practical tips.",
      icon: <Book size={24} />,
    },
    {
      title: "Success Stories",
      description: "Learn from other farmers",
      text: "Real-life experiences and strategies from successful farmers across India.",
      icon: <Users size={24} />,
    },
    {
      title: "Training & Webinars",
      description: "Virtual learning opportunities",
      text: "Access online courses, webinars, and workshops led by agricultural experts.",
      icon: <BarChart3 size={24} />,
    },
    {
      title: "Expert Q&A",
      description: "Get your questions answered",
      text: "Submit your farming queries to our panel of agricultural specialists.",
      icon: <MessageCircle size={24} />,
    },
    {
      title: "Resource Library",
      description: "Educational materials",
      text: "Download PDFs, videos, and tutorials on various farming practices.",
      icon: <Download size={24} />,
    },
    {
      title: "Local Contacts",
      description: "Connect with resources",
      text: "Find suppliers, government offices, veterinarians, and other services near you.",
      icon: <MapPin size={24} />,
    },
    {
      title: "AI Recommendations",
      description: "Smart farming insights",
      text: "Get personalized suggestions for breeds, pricing, feed plans, and more.",
      icon: <Brain size={24} />,
    },
    {
    title: "Chatbot Support",
    description: "Instant assistance",
    text: "Get quick answers to common questions and troubleshooting help.",
    icon: <Bot size={24} />,
  },
];

// Helper to get current cards based on selected type
const getCurrentCards = () => {
    switch (selectedType) {
      case "dairy":
        return dairyCards;
      case "poultry":
        return poultryCards;
      case "marine":
        return marineCards;
      case "bee":
        return beeCards;
      case "organic":
        return organicCards;
      default:
        return dairyCards;
    }
  };

  // Helper to get color scheme based on selected type
  const getColorScheme = () => {
    const type = farmingTypes[selectedType];
    switch (type.color) {
      case "emerald":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "amber":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "blue":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  // Get button color scheme
  const getButtonColor = () => {
    const type = farmingTypes[selectedType];
    switch (type.color) {
      case "emerald":
        return "bg-emerald-600 hover:bg-emerald-700";
      case "amber":
        return "bg-amber-600 hover:bg-amber-700";
      case "blue":
        return "bg-blue-600 hover:bg-blue-700";
      case "yellow":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "green":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-emerald-600 hover:bg-emerald-700";
    }
  };

  // Function to handle card hover
  const handleCardHover = (index: number | null) => {
    setActiveCard(index);
  };

  return (
    <Layout>
      <main className="container mx-auto px-4 py-8 overflow-hidden">
        {!isLoaded ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-emerald-600 font-medium">Loading farming resources...</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Weather and Market Price Widget */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex flex-wrap gap-4"
            >
              <div className="flex-1 p-4 rounded-lg shadow-md bg-gradient-to-r from-blue-400 to-blue-600">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-semibold">Today's Weather</h3>
                    <p className="text-white text-2xl font-bold">{weatherData.temp}°C</p>
                    <p className="text-white opacity-90">
                      {weatherData.condition} | Humidity: {weatherData.humidity}%
                    </p>
                  </div>
                  <div className="text-white text-4xl">
                    {weatherData.condition === "Sunny"
                      ? "☀️"
                      : weatherData.condition === "Rain"
                      ? "🌧️"
                      : weatherData.condition === "Cloudy"
                      ? "☁️"
                      : "⛅"}
                  </div>
                </div>
                <div className="mt-3 flex justify-between">
                  {weatherData.forecast.map((day, i) => (
                    <div key={i} className="text-center text-white">
                      <p className="text-xs">{day.day}</p>
                      <p className="text-lg">
                        {day.condition === "Sunny"
                          ? "☀️"
                          : day.condition === "Rain"
                          ? "🌧️"
                          : day.condition === "Cloudy"
                          ? "☁️"
                          : "⛅"}
                      </p>
                      <p className="text-xs">{day.temp}°C</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 p-4 rounded-lg shadow-md bg-gradient-to-r from-emerald-400 to-emerald-600">
                <h3 className="text-white font-semibold">Market Price Updates</h3>
                <div className="mt-2">
                  {selectedType === "dairy" && (
                    <div className="space-y-1">
                      <p className="text-white flex justify-between">
                        Milk{" "}
                        <span className="font-medium">
                          ₹{marketPrices.dairy.milk}/L <AnimatedPrice value={marketPrices.dairy.milk} />
                        </span>
                      </p>
                      <p className="text-white flex justify-between">
                        Butter{" "}
                        <span className="font-medium">
                          ₹{marketPrices.dairy.butter}/kg{" "}
                          <AnimatedPrice value={marketPrices.dairy.butter} />
                        </span>
                      </p>
                      <p className="text-white flex justify-between">
                        Cheese{" "}
                        <span className="font-medium">
                          ₹{marketPrices.dairy.cheese}/kg{" "}
                          <AnimatedPrice value={marketPrices.dairy.cheese} />
                        </span>
                      </p>
                    </div>
                  )}
                  {selectedType === "poultry" && (
                    <div className="space-y-1">
                      <p className="text-white flex justify-between">
                        Eggs{" "}
                        <span className="font-medium">
                          ₹{marketPrices.poultry.eggs}/piece{" "}
                          <AnimatedPrice value={marketPrices.poultry.eggs} />
                        </span>
                      </p>
                      <p className="text-white flex justify-between">
                        Chicken{" "}
                        <span className="font-medium">
                          ₹{marketPrices.poultry.chicken}/kg{" "}
                          <AnimatedPrice value={marketPrices.poultry.chicken} />
                        </span>
                      </p>
                    </div>
                  )}
                  {selectedType === "marine" && (
                    <div className="space-y-1">
                      <p className="text-white flex justify-between">
                        Rohu{" "}
                        <span className="font-medium">
                          ₹{marketPrices.marine.rohu}/kg <AnimatedPrice value={marketPrices.marine.rohu} />
                        </span>
                      </p>
                      <p className="text-white flex justify-between">
                        Prawns{" "}
                        <span className="font-medium">
                          ₹{marketPrices.marine.prawns}/kg{" "}
                          <AnimatedPrice value={marketPrices.marine.prawns} />
                        </span>
                      </p>
                    </div>
                  )}
                  {selectedType === "bee" && (
                    <div className="space-y-1">
                      <p className="textATOM-white flex justify-between">
                        Honey{" "}
                        <span className="font-medium">
                          ₹{marketPrices.bee.honey}/kg <AnimatedPrice value={marketPrices.bee.honey} />
                        </span>
                      </p>
                    </div>
                  )}
                  {selectedType === "organic" && (
                    <div className="space-y-1">
                      <p className="text-white flex justify-between">
                        Vegetables{" "}
                        <span className="font-medium">
                          ₹{marketPrices.organic.vegetables}/kg{" "}
                          <AnimatedPrice value={marketPrices.organic.vegetables} />
                        </span>
                      </p>
                      <p className="text-white flex justify-between">
                        Fruits{" "}
                        <span className="font-medium">
                          ₹{marketPrices.organic.fruits}/kg{" "}
                          <AnimatedPrice value={marketPrices.organic.fruits} />
                        </span>
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-white opacity-80 mt-2">Prices updated in real-time</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4"
              >
                Specialized Farming Resources
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 max-w-3xl mx-auto"
              >
                Select your farming type to access specialized content, tools, and resources tailored to your specific
                agricultural activities. Our experts have curated comprehensive information to help you optimize your
                farming operations.
              </motion.p>
            </motion.div>

            <Tabs defaultValue="dairy" value={selectedType} onValueChange={setSelectedType} className="w-full">
              <motion.div
                className="flex justify-center mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {Object.keys(farmingTypes).map((type) => (
                    <TabsTrigger
                      key={type}
                      value={type}
                      className={`data-[state=active]:${type === selectedType ? getColorScheme() : ""} relative transition-all duration-300 hover:scale-105`}
                    >
                      <span className="mr-2">{farmingTypes[type].icon}</span> {farmingTypes[type].title.split(" ")[0]}
                      {type === selectedType && (
                        <motion.div
                          layoutId="underline"
                          className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                            type === "dairy"
                              ? "bg-emerald-500"
                              : type === "poultry"
                              ? "bg-amber-500"
                              : type === "marine"
                              ? "bg-blue-500"
                              : type === "bee"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </motion.div>

              {Object.keys(farmingTypes).map((type) => (
                <TabsContent key={type} value={type} className="space-y-6">
                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeIn}
                    className={`${getColorScheme()} p-6 rounded-xl mb-8 transition-all duration-500`}
                  >
                    <div className="flex items-center">
                      <span className="text-4xl mr-4">{farmingTypes[type].icon}</span>
                      <div>
                        <h2 className="text-2xl font-bold mb-1">{farmingTypes[type].title}</h2>
                        <p className="text-gray-700">{farmingTypes[type].description}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={container}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {type === selectedType &&
                      getCurrentCards().map((card, index) => (
                        <motion.div
                          key={index}
                          variants={item}
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          onMouseEnter={() => handleCardHover(index)}
                          onMouseLeave={() => handleCardHover(null)}
                        >
                          <Card
                            className={`h-full overflow-hidden transition-all duration-300 ${
                              activeCard === index ? "shadow-lg border-emerald-300" : "shadow"
                            }`}
                          >
                            <CardHeader>
                              <CardTitle className="flex items-center">{card.title}</CardTitle>
                              <CardDescription>{card.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ul className="list-disc list-inside space-y-2 text-gray-700">
                                {card.items.map((item, i) => (
                                  <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                  >
                                    {item}
                                  </motion.li>
                                ))}
                              </ul>
                            </CardContent>
                            <CardFooter>
                              <Button
                                className={`w-full group ${getButtonColor()} transition-all duration-300`}
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                              >
                                <span>Learn More</span>
                                <motion.span
                                  initial={{ x: 0 }}
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                                  className="ml-2"
                                >
                                  <ArrowRight size={16} />
                                </motion.span>
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-10 text-center"
                  >
                    <Button
                      className={`${getButtonColor()} group transition-all duration-300 transform hover:scale-105`}
                      onClick={() => navigate("/export")}
                    >
                      <span>Sell Your {farmingTypes[type].title.split(" ")[0]} Products</span>
                      <motion.span
                        initial={{ x: 0, opacity: 0.5 }}
                        animate={{ x: 5, opacity: 1 }}
                        transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                        className="ml-2"
                      >
                        <ChevronRight size={18} />
                      </motion.span>
                    </Button>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Common Features Section with Animation */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16 pt-10 border-t border-gray-200"
            >
              <h2 className="text-2xl font-bold text-center text-emerald-800 mb-8">Resources For All Farming Types</h2>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={container}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {resourceCards.map((card, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 hover:border-emerald-300 h-full">
                      <CardHeader>
                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                          {card.icon}
                        </div>
                        <CardTitle>{card.title}</CardTitle>
                        <CardDescription>{card.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{card.text}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* CTA Section with Parallax Effect */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mt-16 p-8 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl text-center relative overflow-hidden shadow-lg"
            >
              {/* Animated background elements */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full z-0"
                style={{
                  backgroundImage: "url(/api/placeholder/1200/400)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.1,
                }}
              />

              <div className="relative z-10">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-white mb-4"
                >
                  Ready to Start or Upgrade Your Farm?
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-white max-w-2xl mx-auto mb-6"
                >
                  Connect with experts, access premium resources, and take your farming to the next level with our
                  tailored solutions.
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    className="bg-white text-emerald-600 hover:bg-emerald-100 font-semibold py-2 px-6 transition-all duration-300 transform hover:scale-105"
                    onClick={() => navigate("/signup")}
                  >
                    Get Started Now
                    <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                      className="ml-2"
                    >
                      <ChevronRight size={18} />
                    </motion.span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default FarmingType;