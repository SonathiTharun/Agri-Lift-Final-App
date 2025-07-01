import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Milk, Bug, Fish, Egg, Leaf, Wheat } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

const FarmingType = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
  };

  // Farming types data
  const farmingTypes = [
    {
      id: "dairy",
      title: t("dairy-farming"),
      description: t("dairy-farming-desc"),
      icon: Milk,
      gradient: "from-blue-400 via-blue-500 to-blue-600",
      hoverGradient: "from-blue-500 via-blue-600 to-blue-700",
      bgPattern: "🐄",
    },
    {
      id: "bee",
      title: t("bee-farming"),
      description: t("bee-farming-desc"),
      icon: Bug,
      gradient: "from-yellow-400 via-amber-500 to-orange-500",
      hoverGradient: "from-yellow-500 via-amber-600 to-orange-600",
      bgPattern: "🐝",
    },
    {
      id: "marine",
      title: t("marine-farming"),
      description: t("marine-farming-desc"),
      icon: Fish,
      gradient: "from-cyan-400 via-teal-500 to-blue-500",
      hoverGradient: "from-cyan-500 via-teal-600 to-blue-600",
      bgPattern: "🐟",
    },
    {
      id: "poultry",
      title: t("poultry-farming"),
      description: t("poultry-farming-desc"),
      icon: Egg,
      gradient: "from-orange-400 via-red-500 to-pink-500",
      hoverGradient: "from-orange-500 via-red-600 to-pink-600",
      bgPattern: "🐔",
    },
    {
      id: "organic",
      title: t("organic-farming"),
      description: t("organic-farming-desc"),
      icon: Leaf,
      gradient: "from-green-400 via-emerald-500 to-teal-500",
      hoverGradient: "from-green-500 via-emerald-600 to-teal-600",
      bgPattern: "🌿",
    },
    {
      id: "crop",
      title: t("crop-farming"),
      description: t("crop-farming-desc"),
      icon: Wheat,
      gradient: "from-amber-400 via-yellow-500 to-lime-500",
      hoverGradient: "from-amber-500 via-yellow-600 to-lime-600",
      bgPattern: "🌾",
    },
  ];

  // Initialize loading
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 800);
  }, []);

  const handleGetStarted = (farmingType: string) => {
    // Navigate to specific farming type page or dashboard
    navigate(`/dashboard?type=${farmingType}`);
  };

  return (
    <Layout>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {!isLoaded ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-emerald-600 font-medium"
            >
              {t("loading-location") || "Loading farming solutions..."}
            </motion.p>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-12">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
              >
                {t("farming-types-title")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              >
                {t("farming-types-subtitle")}
              </motion.p>
            </motion.div>

            {/* Farming Type Cards Grid */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={container}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {farmingTypes.map((type, index) => {
                const IconComponent = type.icon;
                return (
                  <motion.div
                    key={type.id}
                    variants={item}
                    whileHover={{ 
                      y: -10, 
                      scale: 1.02,
                      transition: { duration: 0.3 } 
                    }}
                    onMouseEnter={() => setActiveCard(index)}
                    onMouseLeave={() => setActiveCard(null)}
                    className="group"
                  >
                    <Card className={`h-full overflow-hidden border-0 shadow-xl transition-all duration-500 ${
                      activeCard === index ? 'shadow-2xl' : 'shadow-lg'
                    }`}>
                      {/* Card Background with Gradient */}
                      <div className={`relative bg-gradient-to-br ${type.gradient} p-8 text-white`}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="text-8xl absolute top-4 right-4 transform rotate-12">
                            {type.bgPattern}
                          </div>
                        </div>
                        
                        {/* Icon */}
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6"
                        >
                          <IconComponent size={32} className="text-white" />
                        </motion.div>
                        
                        {/* Title */}
                        <h3 className="relative z-10 text-2xl font-bold mb-3">
                          {type.title}
                        </h3>
                      </div>

                      {/* Card Content */}
                      <CardContent className="p-8">
                        <p className="text-gray-600 leading-relaxed mb-6">
                          {type.description}
                        </p>
                      </CardContent>

                      {/* Card Footer with Get Started Button */}
                      <CardFooter className="p-8 pt-0">
                        <Button
                          onClick={() => handleGetStarted(type.id)}
                          className={`w-full group bg-gradient-to-r ${type.hoverGradient} hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                        >
                          <span className="font-semibold">{t("get-started")}</span>
                          <motion.div
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                            className="ml-2"
                          >
                            <ArrowRight size={18} />
                          </motion.div>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default FarmingType;
