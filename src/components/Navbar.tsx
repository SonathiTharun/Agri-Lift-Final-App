
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, Menu, User, Settings, Farm, Package } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";

export function Navbar() {
  const location = useLocation();
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const [activeItem, setActiveItem] = useState(() => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "dashboard";
    if (path === "/loans") return "loans";
    if (path === "/contact") return "contact";
    if (path === "/market") return "market";
    if (path === "/labour") return "labour";
    if (path === "/machinery") return "machinery";
    if (path === "/export") return "export";
    if (path === "/monitoring") return "monitoring";
    if (path === "/services") return "services";
    return "dashboard";
  });

  useEffect(() => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") setActiveItem("dashboard");
    else if (path === "/loans") setActiveItem("loans");
    else if (path === "/contact") setActiveItem("contact");
    else if (path === "/market") setActiveItem("market");
    else if (path === "/labour") setActiveItem("labour");
    else if (path === "/machinery") setActiveItem("machinery");
    else if (path === "/export") setActiveItem("export");
    else if (path === "/monitoring") setActiveItem("monitoring");
    else if (path === "/services") setActiveItem("services");
  }, [location]);

  const navItems = [
    { id: "dashboard", label: t("dashboard"), path: "/dashboard" },
    { id: "loans", label: t("loans"), path: "/loans" },
    { id: "market", label: t("market"), path: "/market" },
    { id: "labour", label: t("labour"), path: "/labour" },
    { id: "machinery", label: t("machinery"), path: "/machinery" },
    { id: "export", label: t("export"), path: "/export" },
    { id: "monitoring", label: t("monitoring"), path: "/monitoring" },
    { id: "services", label: t("services"), path: "/services" },
    { id: "contact", label: t("contact"), path: "/contact" },
  ];

  // Side menu items
  const sideMenuItems = [
    { id: "farming", label: "Diverse Farming", path: "/farming-type", icon: Farm },
    { id: "profile", label: "Profile", path: "/profile", icon: User },
    { id: "settings", label: "Settings", path: "/settings", icon: Settings },
    { id: "orders", label: "Orders", path: "/orders", icon: Package },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2ecc71] py-2 px-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/20">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[80%] p-0">
              <div className="flex flex-col h-full bg-white">
                <div className="flex items-center justify-center p-4 bg-[#2ecc71]">
                  <img 
                    alt="AgriLift Logo" 
                    className="h-16 w-auto" 
                    src="/lovable-uploads/bad258d5-10ef-4d65-bb8b-35f2420c6caa.png" 
                  />
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">MAIN NAVIGATION</h3>
                  {navItems.map(item => (
                    <DrawerClose asChild key={item.id}>
                      <Link 
                        to={item.path}
                        className={`flex items-center py-2 px-3 rounded-md mb-1 ${
                          activeItem === item.id 
                            ? "bg-[#2ecc71]/10 text-[#2ecc71] font-medium" 
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </DrawerClose>
                  ))}
                  
                  <h3 className="text-sm font-medium text-gray-500 mt-6 mb-2">FEATURES</h3>
                  {sideMenuItems.map(item => (
                    <DrawerClose asChild key={item.id}>
                      <Link 
                        to={item.path}
                        className="flex items-center gap-3 py-2 px-3 rounded-md mb-1 text-gray-700 hover:bg-gray-100"
                      >
                        <item.icon size={18} />
                        {item.label}
                      </Link>
                    </DrawerClose>
                  ))}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
          
          <Link to="/dashboard" className="flex items-center">
            <img 
              alt="AgriLift Logo" 
              className="h-20 w-auto" 
              src="/lovable-uploads/bad258d5-10ef-4d65-bb8b-35f2420c6caa.png" 
            />
          </Link>
        </div>
        
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
          {/* Side menu links for desktop */}
          <div className="hidden md:flex space-x-1 mr-2">
            {sideMenuItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                className="px-2 py-1.5 text-white hover:bg-white/20 rounded-md flex items-center gap-1"
              >
                <item.icon size={16} />
                <span className="sr-only md:not-sr-only md:inline-block">{item.label}</span>
              </Link>
            ))}
          </div>
          
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
    </nav>
  );
}
