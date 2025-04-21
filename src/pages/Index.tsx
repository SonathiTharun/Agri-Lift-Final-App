
import { Navbar } from "@/components/Navbar";
import { WeatherWidget } from "@/components/WeatherWidget";
import { SoilAnalysis } from "@/components/SoilAnalysis";
import { useState } from "react";

const Index = () => {
  const [pageLoaded, setPageLoaded] = useState(false);

  // Simulate page loading
  useState(() => {
    setTimeout(() => setPageLoaded(true), 100);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-soil-light/10 to-foliage-light/10">
      <Navbar />
      
      {/* Weather Widget (Draggable) */}
      <WeatherWidget />
      
      <main className="container mx-auto pt-28 px-4 pb-10">
        <div className="max-w-5xl mx-auto text-center mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-soil-dark mb-4">AgriLift Soil Insight</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your soil report to get detailed analysis, parameter tracking, and personalized crop recommendations
            based on your soil health.
          </p>
        </div>
        
        {/* Main Content Container */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <SoilAnalysis />
        </div>
        
        {/* Footer Information */}
        <div className="mt-16 text-center text-gray-500 text-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p>AgriLift © 2025 • Smart Agricultural Solutions</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
