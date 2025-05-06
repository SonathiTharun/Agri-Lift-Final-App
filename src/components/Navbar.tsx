
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, Menu, Tractor, User, Settings, ShoppingCart } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

export function Navbar() {
  const location = useLocation();
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
  
  const menuItems = [
    { id: "diverse-farming", label: "Diverse Farming", path: "/farming-type", icon: <Tractor size={18} /> },
    { id: "profile", label: "Profile", path: "/profile", icon: <User size={18} /> },
    { id: "settings", label: "Settings", path: "/settings", icon: <Settings size={18} /> },
    { id: "orders", label: "Orders", path: "/orders", icon: <ShoppingCart size={18} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2ecc71] py-2 px-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isMobile ? (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white mr-2 hover:bg-white/20">
                  <Menu size={22} />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="p-4">
                <div className="flex flex-col space-y-3 pt-2 pb-4">
                  {menuItems.map(item => (
                    <Link 
                      key={item.id}
                      to={item.path}
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  {navItems.map(item => (
                    <Link 
                      key={item.id} 
                      to={item.path}
                      onClick={() => {
                        setActiveItem(item.id);
                        setIsDrawerOpen(false);
                      }}
                      className={`flex items-center px-3 py-2 rounded-md mb-1 ${
                        activeItem === item.id 
                          ? "bg-[#2ecc71] text-white font-medium" 
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white mr-2 hover:bg-white/20">
                  <Menu size={22} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white">
                {menuItems.map(item => (
                  <DropdownMenuItem key={item.id} asChild>
                    <Link to={item.path} className="flex items-center gap-2 cursor-pointer">
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
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
