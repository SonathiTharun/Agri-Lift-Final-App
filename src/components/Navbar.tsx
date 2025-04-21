import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function Navbar() {
  const location = useLocation();
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const [activeItem, setActiveItem] = useState(() => {
    const path = location.pathname;
    if (path === "/home") return "home";
    if (path === "/loans") return "loans";
    if (path === "/contact") return "contact";
    if (path === "/market") return "market";
    if (path === "/labour") return "labour";
    if (path === "/machinery") return "machinery";
    if (path === "/export") return "export";
    if (path === "/monitoring") return "monitoring";
    if (path === "/services") return "services";
    return "home";
  });
  useEffect(() => {
    const path = location.pathname;
    if (path === "/home") setActiveItem("home");else if (path === "/loans") setActiveItem("loans");else if (path === "/contact") setActiveItem("contact");else if (path === "/market") setActiveItem("market");else if (path === "/labour") setActiveItem("labour");else if (path === "/machinery") setActiveItem("machinery");else if (path === "/export") setActiveItem("export");else if (path === "/monitoring") setActiveItem("monitoring");else if (path === "/services") setActiveItem("services");
  }, [location]);
  const navItems = [{
    id: "home",
    label: t("home"),
    path: "/home"
  }, {
    id: "loans",
    label: t("loans"),
    path: "/loans"
  }, {
    id: "market",
    label: t("market"),
    path: "/market"
  }, {
    id: "labour",
    label: t("labour"),
    path: "/labour"
  }, {
    id: "machinery",
    label: t("machinery"),
    path: "/machinery"
  }, {
    id: "export",
    label: t("export"),
    path: "/export"
  }, {
    id: "monitoring",
    label: t("monitoring"),
    path: "/monitoring"
  }, {
    id: "services",
    label: t("services"),
    path: "/services"
  }, {
    id: "contact",
    label: t("contact"),
    path: "/contact"
  }];
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2ecc71] py-2 px-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home" className="flex items-center">
          <img alt="AgriLift Logo" className="h-12 w-auto invert" src="/lovable-uploads/3c35378f-1080-4789-a3e0-6825864a6de9.png" />
        </Link>
        
        <div className="hidden md:flex space-x-1">
          {navItems.map(item => <Link key={item.id} to={item.path} onClick={() => setActiveItem(item.id)} className={`px-3 py-1.5 text-sm rounded-md transition duration-200 ${activeItem === item.id ? "bg-white text-foliage-dark font-medium" : "text-white hover:bg-white/20"}`}>
              {item.label}
            </Link>)}
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
        </div>
      </div>
    </nav>;
}
