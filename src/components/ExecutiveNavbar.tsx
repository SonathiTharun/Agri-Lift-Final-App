import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, Menu, Users, BarChart3, DollarSign, Settings, Bell, LogOut, Shield, Sparkles, User } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { GlassNav, AnimatedDrawer, AnimatedMenuItem } from "@/components/ui/glass-nav";
import { AnimatedNavItem, AnimatedNavContainer } from "@/components/ui/animated-nav-item";
import { AnimatedLogo } from "@/components/ui/animated-logo";

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
    { id: "profile", label: "Profile", path: "/profile", icon: <User size={18} /> },
    { id: "notifications", label: "Notifications", path: "/executive/notifications", icon: <Bell size={18} /> },
    { id: "settings", label: "Settings", path: "/executive/settings", icon: <Settings size={18} /> },
    { id: "logout", label: "Logout", path: "/", icon: <LogOut size={18} /> },
  ];

  return (
    <GlassNav variant="executive" className="py-1 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          {isMobile ? (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white mr-2 hover:bg-white/20 transition-all duration-300 rounded-xl backdrop-blur-sm border border-white/20"
                  >
                    <Menu size={22} />
                  </Button>
                </motion.div>
              </DrawerTrigger>
              <DrawerContent className="p-0 border-none">
                <AnimatedDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                  <div className="p-6">
                    <motion.div
                      className="flex flex-col space-y-3 pt-2 pb-4"
                      variants={{
                        open: {
                          transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                        },
                        closed: {
                          transition: { staggerChildren: 0.05, staggerDirection: -1 }
                        }
                      }}
                    >
                      {menuItems.map((item, index) => (
                        <AnimatedMenuItem key={item.id} onClick={() => setIsDrawerOpen(false)}>
                          <Link
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-all duration-300 group"
                          >
                            <motion.div
                              className="text-green-800 group-hover:text-green-900"
                              whileHover={{ rotate: 5, scale: 1.1 }}
                            >
                              {item.icon}
                            </motion.div>
                            <span className="font-medium text-gray-700 group-hover:text-green-800">
                              {item.label}
                            </span>
                          </Link>
                        </AnimatedMenuItem>
                      ))}
                    </motion.div>

                    <div className="border-t border-gray-200 pt-4">
                      <motion.div
                        variants={{
                          open: {
                            transition: { staggerChildren: 0.05, delayChildren: 0.3 }
                          },
                          closed: {
                            transition: { staggerChildren: 0.02, staggerDirection: -1 }
                          }
                        }}
                      >
                        {navItems.map((item, index) => (
                          <AnimatedMenuItem
                            key={item.id}
                            onClick={() => {
                              setActiveItem(item.id);
                              setIsDrawerOpen(false);
                            }}
                          >
                            <div className={`flex items-center px-4 py-3 rounded-xl mb-2 transition-all duration-300 ${
                              activeItem === item.id
                                ? "bg-gradient-to-r from-green-800 to-emerald-800 text-white shadow-lg"
                                : "hover:bg-green-50 text-gray-700 hover:text-green-800"
                            }`}>
                              <Link to={item.path} className="w-full">
                                <span className="font-medium text-sm break-words">{item.label}</span>
                              </Link>
                            </div>
                          </AnimatedMenuItem>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </AnimatedDrawer>
              </DrawerContent>
            </Drawer>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white mr-2 hover:bg-white/20 transition-all duration-300 rounded-xl backdrop-blur-sm border border-white/20"
                  >
                    <Menu size={22} />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-64 bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl rounded-xl p-2"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <DropdownMenuItem asChild className="rounded-lg mb-1">
                        <Link
                          to={item.path}
                          className="flex items-center gap-3 cursor-pointer px-3 py-2.5 hover:bg-green-50 transition-all duration-300 group"
                        >
                          <motion.div
                            className="text-green-800 group-hover:text-green-900"
                            whileHover={{ rotate: 5, scale: 1.1 }}
                          >
                            {item.icon}
                          </motion.div>
                          <span className="font-medium text-gray-700 group-hover:text-green-800">
                            {item.label}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    </motion.div>
                  ))}
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <AnimatedLogo
            to="/executive-dashboard"
            variant="executive"
            size="xl"
            showText={true}
          />
        </div>

        <AnimatedNavContainer className="hidden md:flex space-x-1 lg:space-x-2 flex-wrap justify-center">
          {navItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnimatedNavItem
                to={item.path}
                isActive={activeItem === item.id}
                onClick={() => setActiveItem(item.id)}
                variant="glass"
                size="sm"
                className="relative overflow-hidden text-xs lg:text-sm"
              >
                {item.label}
              </AnimatedNavItem>
            </motion.div>
          ))}
        </AnimatedNavContainer>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300 rounded-xl backdrop-blur-sm relative"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Bell size={16} className="mr-2" />
              </motion.div>
              <motion.span
                className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 absolute -top-1 -right-1"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                3
              </motion.span>
            </Button>
          </motion.div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300 rounded-xl backdrop-blur-sm"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Globe size={16} className="mr-2" />
                  </motion.div>
                  {language.toUpperCase()}
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl rounded-xl p-2"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {[
                  { code: 'en', label: 'English', flag: '🇺🇸' },
                  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
                  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
                  { code: 'te', label: 'తెలుగు', flag: '🇮🇳' }
                ].map((lang, index) => (
                  <motion.div
                    key={lang.code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DropdownMenuItem
                      onClick={() => setLanguage(lang.code)}
                      className="rounded-lg mb-1 cursor-pointer hover:bg-green-50 transition-all duration-300"
                    >
                      <span className="mr-2">{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
                    </DropdownMenuItem>
                  </motion.div>
                ))}
              </motion.div>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
    </GlassNav>
  );
}
