
import { WeatherWidget } from "@/components/WeatherWidget";
import { SoilAnalysis } from "@/components/SoilAnalysis";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Dashboard = () => {
  const [pageLoaded, setPageLoaded] = useState(false);

  // Simulate page loading
  useState(() => {
    setTimeout(() => setPageLoaded(true), 100);
  });

  return (
    <Layout>
      {/* Weather Widget (Draggable) */}
      <WeatherWidget />
      
      <main className="container mx-auto px-4 pb-10">
        <div className="max-w-5xl mx-auto text-center mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-soil-dark mb-4">AgriLift Dashboard</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Welcome to your personalized agriculture dashboard. Access your soil insights, farm progress tracking, 
            and get recommendations based on your farming activities.
          </p>
        </div>
        
        {/* Farming Type Selection Card */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Select Your Farming Type</h2>
          <p className="text-gray-600 mb-6">
            Access specialized content, tools, and resources tailored to your specific farming activity.
          </p>
          <Link to="/farming-type" className="inline-flex items-center">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Explore Farming Types <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        {/* Crop Allocation Card */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-semibold text-foliage-dark mb-4">Crop Allocation Planner</h2>
          <p className="text-gray-600 mb-6">
            Plan your crop allocation with our AI-powered tool. Maximize yield and optimize resource utilization based on
            your land, soil type, and local climate conditions.
          </p>
          <Link to="/crop-allocation" className="inline-flex items-center">
            <Button className="bg-foliage hover:bg-foliage-dark">
              Plan Your Crops <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        {/* Main Content Container */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <SoilAnalysis />
        </div>
        
        {/* Footer Information */}
        <div className="mt-16 text-center text-gray-500 text-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p>AgriLift © 2025 • Smart Agricultural Solutions</p>
        </div>
      </main>
    </Layout>
  );
};

export default Dashboard;
