import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNav, setLoadingNav] = useState<string | null>(null);

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

  const notifications = [
    { id: 1, title: "New Farmer Registered", time: "2m ago" },
    { id: 2, title: "Loan Approved", time: "10m ago" },
    { id: 3, title: "System Update Scheduled", time: "1h ago" },
  ];

  const handleNavClick = (id: string, path: string) => {
    setLoadingNav(id);
    setTimeout(() => {
      setActiveItem(id);
      setLoadingNav(null);
      navigate(path);
    }, 400); // Simulate loading
  };

  const handleLogout = () => {
    // Clear session (simulate)
    localStorage.removeItem("userSession");
    navigate("/");
  };

  return (
    <TooltipProvider>
      <GlassNav variant="executive" className="py-1 px-4 agrilift-gradient-primary animate-glow shadow-2xl">
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
                  className="w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 shadow-2xl rounded-xl p-2"
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleNavClick(item.id, item.path)}
                      className={`relative overflow-hidden text-xs lg:text-sm agrilift-text-secondary px-4 py-2 rounded-lg transition-all duration-300 focus:outline-none ${activeItem === item.id ? 'navbar-active border-b-4 border-emerald-400 animate-glow bg-white/10 shadow-lg' : 'hover:bg-emerald-50 hover:text-emerald-900'} ${loadingNav === item.id ? 'opacity-60 pointer-events-none' : ''}`}
                      aria-current={activeItem === item.id}
                    >
                      {item.label}
                      {activeItem === item.id && (
                        <motion.div
                          className="absolute left-0 right-0 bottom-0 h-1 bg-emerald-400 rounded-full animate-glow"
                          layoutId="underline"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      {loadingNav === item.id && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-emerald-400">●</span>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{item.label}</TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </AnimatedNavContainer>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="agrilift-button-primary bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300 rounded-xl backdrop-blur-sm relative"
                    onClick={() => setShowNotifications((v) => !v)}
                    aria-label="Notifications"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Bell size={16} className="mr-2" />
                    </motion.div>
                    <motion.span
                      className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 absolute -top-1 -right-1"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {notifications.length}
                    </motion.span>
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            {showNotifications && (
              <div className="absolute right-24 top-16 w-80 bg-white rounded-xl shadow-2xl z-50 agrilift-card animate-fade-in border border-emerald-100">
                <div className="p-4 border-b agrilift-border font-semibold agrilift-text-primary">Notifications</div>
                <ul className="max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <li key={n.id} className="px-4 py-3 border-b last:border-b-0 agrilift-border hover:bg-emerald-50 transition-all cursor-pointer">
                      <div className="font-medium agrilift-text-secondary">{n.title}</div>
                      <div className="text-xs agrilift-text-muted">{n.time}</div>
                    </li>
                  ))}
                </ul>
                <div className="p-2 text-center">
                  <button className="text-emerald-700 hover:underline text-sm" onClick={() => setShowNotifications(false)}>Close</button>
                </div>
              </div>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="agrilift-button-secondary bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300 rounded-xl backdrop-blur-sm"
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
              </TooltipTrigger>
              <TooltipContent>Change Language</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="agrilift-button-secondary bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300 rounded-xl backdrop-blur-sm"
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
                className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 shadow-2xl rounded-xl p-2"
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
                        onClick={() => setLanguage(lang.code as 'en' | 'hi' | 'ta' | 'te')}
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

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="ml-2 focus:outline-none"
                  onClick={() => setShowProfileMenu((v) => !v)}
                  aria-label="Profile"
                >
                  <img
                    src="/public/dairy-lift-logo.png"
                    alt="Profile"
                    className="w-9 h-9 rounded-full border-2 border-emerald-400 shadow-md hover:shadow-lg transition-all duration-300 object-cover animate-glow"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>Profile</TooltipContent>
            </Tooltip>
            {showProfileMenu && (
              <div className="absolute right-4 top-16 w-48 bg-white rounded-xl shadow-xl z-50 agrilift-card animate-fade-in">
                <div className="p-4 border-b agrilift-border">
                  <div className="font-semibold agrilift-text-primary">Executive User</div>
                  <div className="text-xs agrilift-text-muted">executive@agrilift.com</div>
                </div>
                <div className="py-2">
                  <button onClick={() => { setShowProfileMenu(false); navigate('/profile'); }} className="block w-full text-left px-4 py-2 agrilift-text-secondary hover:bg-green-50 rounded-lg transition-all">Profile</button>
                  <button onClick={() => { setShowProfileMenu(false); navigate('/executive/settings'); }} className="block w-full text-left px-4 py-2 agrilift-text-secondary hover:bg-green-50 rounded-lg transition-all">Settings</button>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 agrilift-text-secondary hover:bg-green-50 rounded-lg transition-all">Logout</button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </GlassNav>
    </TooltipProvider>
  );
}
