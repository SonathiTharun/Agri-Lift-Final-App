
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Activity, Brain, TrendingUp, Settings, Calendar, FileText, Satellite, BarChart, PieChart } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import VisualizationArea from "./VisualizationArea";
import SummaryTab from "./tabs/SummaryTab";
import InsightsTab from "./tabs/InsightsTab";
import FinancialProjections from "./analytics/FinancialProjections";
import ResourceOptimization from "./analytics/ResourceOptimization";
import CropCalendar from "./analytics/CropCalendar";
import LiveMarketTicker from "./realtime/LiveMarketTicker";
import IoTSensorDashboard from "./realtime/IoTSensorDashboard";
import AIRecommendationEngine from "./analytics/AIRecommendationEngine";
import AnimatedCard from "./modern/AnimatedCard";
import AnimatedCounter from "./modern/AnimatedCounter";
import LiveStatusIndicator from "./modern/LiveStatusIndicator";
import GradientBackground from "./modern/GradientBackground";
import ModernTabs from "./modern/ModernTabs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface LandDetails {
  location: string;
  pincode: string;
  plotNumber: string;
  totalArea: number;
  soilType: string;
  climateType: string;
}

interface SelectedCrop {
  id: string;
  name: string;
  area: number;
  percentage: number;
  estimatedYield: number;
}

interface PlotVisualizationEnhancedProps {
  landDetails: LandDetails;
  selectedCrops: SelectedCrop[];
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const PlotVisualizationEnhanced = ({
  landDetails,
  selectedCrops,
  onSubmit,
  onBack,
  isSubmitting
}: PlotVisualizationEnhancedProps) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const totalYield = selectedCrops.reduce((sum, crop) => sum + crop.estimatedYield, 0);
  const estimatedRevenue = totalYield * 2000;
  
  return (
    <GradientBackground variant="primary">
      <motion.div
        className="space-y-6 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🚀 Real-Time Farm Intelligence
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Advanced AI-powered monitoring and intelligent insights for your smart farming operations
          </p>
        </motion.div>

        {/* Main 3D Field Section - Full Width */}
        <AnimatedCard
          className="w-full min-h-[500px]"
          variant="glass"
          delay={0.2}
          title="🌱 Interactive Farm Field"
          icon={<Satellite className="h-6 w-6 text-blue-600" />}
        >
          <div className="relative h-full">
            <VisualizationArea 
              selectedCrops={selectedCrops}
              rotationEnabled={true}
            />
            <div className="absolute top-4 right-4">
              <LiveStatusIndicator status="online" label="Live Monitoring" />
            </div>
          </div>
        </AnimatedCard>

        {/* Quick Stats Cards Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
        >
          <AnimatedCard
            variant="gradient"
            delay={0.3}
            className="bg-gradient-to-br from-green-400 to-green-600 text-white"
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">
                <AnimatedCounter value={selectedCrops.length} />
              </div>
              <div className="text-green-100 font-medium">Active Crops</div>
              <div className="text-sm text-green-200 mt-1">Growing varieties</div>
            </CardContent>
          </AnimatedCard>
          
          <AnimatedCard
            variant="gradient"
            delay={0.4}
            className="bg-gradient-to-br from-blue-400 to-blue-600 text-white"
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">
                <AnimatedCounter value={landDetails.totalArea} />
              </div>
              <div className="text-blue-100 font-medium">Total Area</div>
              <div className="text-sm text-blue-200 mt-1">Acres cultivated</div>
            </CardContent>
          </AnimatedCard>
          
          <AnimatedCard
            variant="gradient"
            delay={0.5}
            className="bg-gradient-to-br from-purple-400 to-purple-600 text-white"
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">
                <AnimatedCounter
                  value={totalYield}
                  decimals={1}
                  suffix=" tons"
                />
              </div>
              <div className="text-purple-100 font-medium">Expected Yield</div>
              <div className="text-sm text-purple-200 mt-1">Total harvest</div>
            </CardContent>
          </AnimatedCard>
          
          <AnimatedCard
            variant="gradient"
            delay={0.6}
            className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
          >
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold mb-2">
                <AnimatedCounter
                  value={estimatedRevenue}
                  prefix="₹"
                />
              </div>
              <div className="text-yellow-100 font-medium">Est. Revenue</div>
              <div className="text-sm text-yellow-200 mt-1">Projected income</div>
            </CardContent>
          </AnimatedCard>
        </motion.div>

        {/* IoT Sensor Dashboard */}
        <AnimatedCard
          variant="glass"
          delay={0.7}
          title="📊 Real-Time Farm Monitoring"
          icon={<Activity className="h-6 w-6 text-green-600" />}
        >
          <IoTSensorDashboard location={landDetails.location} />
        </AnimatedCard>

        {/* Live Market Ticker */}
        <AnimatedCard variant="gradient" delay={0.8}>
          <LiveMarketTicker location={landDetails.location} />
        </AnimatedCard>

        {/* Advanced Analytics Dashboard */}
        <AnimatedCard
          variant="glass"
          delay={0.9}
          title="🧠 Comprehensive Analytics Suite"
          icon={<Brain className="h-6 w-6 text-purple-600" />}
        >
          <ModernTabs
            defaultValue="overview"
            onValueChange={setActiveTab}
            tabs={[
              {
                value: "overview",
                label: "Overview",
                icon: <Activity className="h-4 w-4" />,
                content: (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SummaryTab 
                      landDetails={landDetails}
                      selectedCrops={selectedCrops}
                      onSubmit={onSubmit}
                      isSubmitting={isSubmitting}
                    />
                    <InsightsTab 
                      landDetails={landDetails}
                      selectedCrops={selectedCrops}
                    />
                  </div>
                )
              },
              {
                value: "ai-insights",
                label: "AI Insights",
                icon: <Brain className="h-4 w-4" />,
                content: (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <AIRecommendationEngine 
                      landDetails={landDetails}
                      selectedCrops={selectedCrops}
                      location={landDetails.location}
                    />
                    
                    <div className="space-y-6">
                      {/* Predictive Analytics */}
                      <AnimatedCard variant="gradient" delay={0.1}>
                        <CardHeader>
                          <CardTitle className="flex items-center text-lg">
                            <Satellite className="h-5 w-5 mr-2 text-blue-600" />
                            🔮 Predictive Analytics
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <motion.div 
                            className="bg-white rounded-lg p-4 shadow-sm"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <h4 className="font-medium text-blue-900 mb-2">📈 Yield Prediction</h4>
                            <p className="text-sm text-blue-800 mb-2">
                              Based on AI analysis of current conditions:
                            </p>
                            <div className="text-2xl font-bold text-blue-900">
                              <AnimatedCounter
                                value={totalYield}
                                decimals={1}
                                suffix=" tons"
                              />
                            </div>
                            <p className="text-xs text-blue-700 mt-1">±5% confidence interval</p>
                          </motion.div>
                          
                          <motion.div 
                            className="bg-white rounded-lg p-4 shadow-sm"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <h4 className="font-medium text-green-900 mb-2">🛡️ Disease Risk Assessment</h4>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-green-800">Current Risk Level</span>
                              <span className="text-lg font-bold text-green-900">Low</span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                              <motion.div 
                                className="bg-green-600 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: '25%' }}
                                transition={{ duration: 1, delay: 0.5 }}
                              />
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className="bg-white rounded-lg p-4 shadow-sm"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <h4 className="font-medium text-yellow-900 mb-2">📊 Market Forecast</h4>
                            <p className="text-sm text-yellow-800">
                              AI predicts 12% price increase over next 3 months
                            </p>
                            <div className="text-lg font-bold text-yellow-900 mt-1">
                              🎯 Optimal selling: Week 8-10
                            </div>
                          </motion.div>
                        </CardContent>
                      </AnimatedCard>
                      
                      {/* Risk Matrix */}
                      <AnimatedCard delay={0.2}>
                        <CardHeader>
                          <CardTitle>⚠️ Smart Risk Assessment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { label: "Weather Risk", level: "Medium", color: "red", icon: "🌦️", desc: "Heavy rain predicted" },
                              { label: "Market Risk", level: "Low", color: "green", icon: "📈", desc: "Stable demand" },
                              { label: "Resource Risk", level: "Medium", color: "yellow", icon: "💧", desc: "Water availability" },
                              { label: "Pest Risk", level: "Low", color: "blue", icon: "🐛", desc: "Favorable conditions" }
                            ].map((risk, index) => (
                              <motion.div
                                key={risk.label}
                                className={`bg-${risk.color}-50 border border-${risk.color}-200 rounded-lg p-3`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <h4 className={`font-medium text-${risk.color}-900 text-sm flex items-center`}>
                                  <span className="mr-2">{risk.icon}</span>
                                  {risk.label}
                                </h4>
                                <div className={`text-lg font-bold text-${risk.color}-900`}>{risk.level}</div>
                                <p className={`text-xs text-${risk.color}-700`}>{risk.desc}</p>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </AnimatedCard>
                    </div>
                  </div>
                )
              },
              {
                value: "financial",
                label: "Financial",
                icon: <TrendingUp className="h-4 w-4" />,
                content: <FinancialProjections selectedCrops={selectedCrops} landDetails={landDetails} />
              },
              {
                value: "resources",
                label: "Resources",
                icon: <Settings className="h-4 w-4" />,
                content: <ResourceOptimization selectedCrops={selectedCrops} landDetails={landDetails} />
              },
              {
                value: "calendar",
                label: "Calendar",
                icon: <Calendar className="h-4 w-4" />,
                content: <CropCalendar selectedCrops={selectedCrops} />
              },
              {
                value: "reports",
                label: "Reports",
                icon: <FileText className="h-4 w-4" />,
                content: (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatedCard delay={0.1}>
                      <CardHeader>
                        <CardTitle>📄 Export Options</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          { icon: <FileText className="h-4 w-4" />, label: "Comprehensive Report (PDF)" },
                          { icon: <BarChart className="h-4 w-4" />, label: "Analytics to Excel" },
                          { icon: <PieChart className="h-4 w-4" />, label: "Real-Time Dashboard" },
                          { icon: <Activity className="h-4 w-4" />, label: "IoT Data History" }
                        ].map((item, index) => (
                          <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="outline" className="w-full justify-start">
                              {item.icon}
                              <span className="ml-2">{item.label}</span>
                            </Button>
                          </motion.div>
                        ))}
                      </CardContent>
                    </AnimatedCard>
                    
                    <AnimatedCard delay={0.2}>
                      <CardHeader>
                        <CardTitle>🤝 Sharing & Collaboration</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          "Share Real-Time Dashboard",
                          "Send to Agricultural Advisor", 
                          "Submit to Bank for Loan",
                          "Create Investor Presentation"
                        ].map((label, index) => (
                          <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="outline" className="w-full justify-start">
                              {label}
                            </Button>
                          </motion.div>
                        ))}
                      </CardContent>
                    </AnimatedCard>
                  </div>
                )
              }
            ]}
          />
        </AnimatedCard>
        
        {/* Action Buttons */}
        <motion.div 
          className="flex justify-between pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center bg-white/50 backdrop-blur-sm border-white/30 shadow-lg hover:bg-white/70"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to Selection
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={onSubmit}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 flex items-center shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Saving Smart Plan...
                </>
              ) : (
                '🚀 Save Complete Plan'
              )}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </GradientBackground>
  );
};

export default PlotVisualizationEnhanced;
