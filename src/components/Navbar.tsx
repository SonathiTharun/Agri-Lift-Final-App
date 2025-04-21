
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(() => {
    // Set initial active state based on current path
    const path = location.pathname;
    if (path === "/loans") return "loans";
    if (path === "/contact") return "contact";
    // Add more path checks as needed
    return "home"; // Default
  });

  const navItems = [
    { id: "home", label: "Home", path: "/" },
    { id: "loans", label: "Loans", path: "/loans" },
    { id: "contact", label: "Contact", path: "/contact" },
    { id: "market", label: "Market", path: "/market" },
    { id: "labour", label: "Labour", path: "/labour" },
    { id: "machinery", label: "Machinery", path: "/machinery" },
    { id: "export", label: "Export", path: "/export" },
    { id: "monitoring", label: "Monitoring", path: "/monitoring" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-foliage-dark via-foliage to-foliage-light py-2 px-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-white font-bold text-xl mr-2">AgriLift</h1>
          <span className="bg-white text-foliage-dark text-xs px-1.5 py-0.5 rounded-md font-semibold">SOIL INSIGHT</span>
        </Link>
        
        <div className="hidden md:flex space-x-1">
          {navItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setActiveItem(item.id)}
              className={`px-3 py-1.5 text-sm rounded-md transition duration-200 ${
                activeItem === item.id 
                  ? "bg-white text-foliage-dark font-medium" 
                  : "text-white hover:bg-white/20"
              }`}
            >
              {item.label}
            </Link>
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
