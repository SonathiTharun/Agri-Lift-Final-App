
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function Navbar() {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [activeItem, setActiveItem] = useState(() => {
    // Set initial active state based on current path
    const path = location.pathname;
    if (path === "/home") return "home";
    if (path === "/loans") return "loans";
    if (path === "/contact") return "contact";
    if (path === "/market") return "market";
    if (path === "/labour") return "labour";
    if (path === "/machinery") return "machinery";
    if (path === "/export") return "export";
    if (path === "/monitoring") return "monitoring";
    // Add more path checks as needed
    return "welcome"; // Default
  });

  // Update active state when location changes
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActiveItem("welcome");
    else if (path === "/home") setActiveItem("home");
    else if (path === "/loans") setActiveItem("loans");
    else if (path === "/contact") setActiveItem("contact");
    else if (path === "/market") setActiveItem("market");
    else if (path === "/labour") setActiveItem("labour");
    else if (path === "/machinery") setActiveItem("machinery");
    else if (path === "/export") setActiveItem("export");
    else if (path === "/monitoring") setActiveItem("monitoring");
    // Add more path checks as needed
  }, [location]);

  const navItems = [
    { id: "welcome", label: "Welcome", path: "/" },
    { id: "home", label: t("home"), path: "/home" },
    { id: "loans", label: t("loans"), path: "/loans" },
    { id: "market", label: t("market"), path: "/market" },
    { id: "labour", label: t("labour"), path: "/labour" },
    { id: "machinery", label: t("machinery"), path: "/machinery" },
    { id: "export", label: t("export"), path: "/export" },
    { id: "monitoring", label: t("monitoring"), path: "/monitoring" },
    { id: "contact", label: t("contact"), path: "/contact" },
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
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Globe size={16} className="mr-1" /> {language.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('hi')}>हिंदी</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ta')}>தமிழ்</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('te')}>తెలుగు</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="md:hidden text-white bg-transparent hover:bg-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
}
