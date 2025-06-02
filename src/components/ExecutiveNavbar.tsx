import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, Menu, Users, BarChart3, DollarSign, Settings, Bell, LogOut } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

export function ExecutiveNavbar() {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(() => {
    const path = location.pathname;
    if (path === "/executive-dashboard") return "dashboard";
    if (path === "/executive/farmers") return "farmers";
    if (path === "/executive/analytics") return "analytics";
    if (path === "/executive/financial") return "financial";
    if (path === "/executive/operations") return "operations";
    if (path === "/executive/communications") return "communications";
    return "dashboard";
  });

  useEffect(() => {
    const path = location.pathname;
    if (path === "/executive-dashboard") setActiveItem("dashboard");
    else if (path === "/executive/farmers") setActiveItem("farmers");
    else if (path === "/executive/analytics") setActiveItem("analytics");
    else if (path === "/executive/financial") setActiveItem("financial");
    else if (path === "/executive/operations") setActiveItem("operations");
    else if (path === "/executive/communications") setActiveItem("communications");
  }, [location]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", path: "/executive-dashboard" },
    { id: "farmers", label: "Farmers", path: "/executive/farmers" },
    { id: "analytics", label: "Analytics", path: "/executive/analytics" },
    { id: "financial", label: "Financial", path: "/executive/financial" },
    { id: "operations", label: "Operations", path: "/executive/operations" },
    { id: "communications", label: "Communications", path: "/executive/communications" },
  ];
  
  const menuItems = [
    { id: "notifications", label: "Notifications", path: "/executive/notifications", icon: <Bell size={18} /> },
    { id: "settings", label: "Settings", path: "/executive/settings", icon: <Settings size={18} /> },
    { id: "logout", label: "Logout", path: "/", icon: <LogOut size={18} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a472a] py-1 px-4 shadow-md">
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
                          ? "bg-[#1a472a] text-white font-medium" 
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
          
          <Link to="/executive-dashboard" className="flex items-center">
            <img 
              alt="AgriLift Executive Portal" 
              className="h-12 w-auto"
              src="/lovable-uploads/bad258d5-10ef-4d65-bb8b-35f2420c6caa.png" 
            />
            <span className="ml-2 text-white font-semibold hidden md:block">Executive Portal</span>
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
                  ? "bg-white text-green-800 font-medium" 
                  : "text-white hover:bg-white/20"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            <Bell size={16} className="mr-1" /> 3
          </Button>
          
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
