
import { useState } from "react";

export function Navbar() {
  const [activeItem, setActiveItem] = useState("home");

  const navItems = [
    { id: "home", label: "Home" },
    { id: "loans", label: "Loans" },
    { id: "contact", label: "Contact" },
    { id: "market", label: "Market" },
    { id: "labour", label: "Labour" },
    { id: "machinery", label: "Machinery" },
    { id: "export", label: "Export" },
    { id: "monitoring", label: "Monitoring" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-foliage-dark via-foliage to-foliage-light py-2 px-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-white font-bold text-xl mr-2">AgriLift</h1>
          <span className="bg-white text-foliage-dark text-xs px-1.5 py-0.5 rounded-md font-semibold">SOIL INSIGHT</span>
        </div>
        
        <div className="hidden md:flex space-x-1">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`px-3 py-1.5 text-sm rounded-md transition duration-200 ${
                activeItem === item.id 
                  ? "bg-white text-foliage-dark font-medium" 
                  : "text-white hover:bg-white/20"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        <button className="md:hidden text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
