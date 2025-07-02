import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DairyLiftRoutes from "./routes";
import { CartSidebar } from "@/components/CartSidebar";

// Example Dairy Lift color scheme
const dairyLiftBg = "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 min-h-screen";
const sidebarBg = "bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-800/90 bg-opacity-90 text-white w-80 min-h-screen p-8 flex flex-col fixed top-0 left-0 z-50 transition-transform duration-300 shadow-2xl rounded-r-3xl backdrop-blur-lg border-r-2 border-blue-300";
const sidebarClosed = "-translate-x-full";
const sidebarOpen = "translate-x-0";
const overlayBg = "fixed inset-0 bg-black bg-opacity-30 z-40";
const hamburgerBg = "bg-blue-700 text-white p-4 fixed top-4 left-4 rounded-lg shadow-lg z-50";
const topNavBg = "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500/80 bg-opacity-80 backdrop-blur-lg shadow-xl flex items-center justify-between px-8 py-2 sticky top-0 z-40 rounded-b-2xl border-b border-blue-200";
const navLinkStyle = `relative mx-2 px-4 py-2 rounded-full font-bold text-white transition-all duration-200 ease-in-out
  hover:bg-white/10 hover:text-emerald-200 focus:bg-white/20 focus:text-emerald-300
  after:content-[''] after:absolute after:left-4 after:right-4 after:-bottom-1 after:h-1 after:rounded-full
  after:bg-gradient-to-r after:from-emerald-400 after:to-cyan-400 after:opacity-0 hover:after:opacity-100 after:transition-all after:duration-300`;

const topNavLinks = [
  { label: "Home", path: "/dairy-lift" },
  { label: "Livestock Market", path: "/dairy-lift/livestock-market" },
  { label: "Equipment Mart", path: "/dairy-lift/equipment-mart" },
  { label: "Sell Your Produce", path: "/dairy-lift/sell-produce" },
  { label: "Knowledge Hub", path: "/dairy-lift/knowledge-hub" },
];

const languages = [
  { code: "en", label: "English" },
  { code: "te", label: "Telugu" },
  { code: "hi", label: "Hindi" },
  { code: "ta", label: "Tamil" },
];

const HamburgerIcon = ({ onClick }: { onClick: () => void }) => (
  <button
    className="mr-4 focus:outline-none"
    aria-label="Open sidebar"
    onClick={onClick}
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  </button>
);

const CloseIcon = ({ onClick }: { onClick: () => void }) => (
  <button
    className="absolute top-4 right-4 text-white hover:text-blue-200 text-2xl focus:outline-none"
    aria-label="Close sidebar"
    onClick={onClick}
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
);

const Sidebar = ({ onHome, onClose }: { onHome: () => void; onClose: () => void }) => (
  <aside className={sidebarBg + " relative"}>
    <CloseIcon onClick={onClose} />
    <div className="flex flex-col items-center mt-8 mb-12">
      <div className="bg-white rounded-full p-3 shadow-lg mb-3">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12l2 2 4-4 8 8 4-4" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold tracking-wide">Dairy Lift</h2>
    </div>
    <div className="flex-1 flex flex-col justify-center items-center">
      <button
        className="w-full bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:from-emerald-500 hover:to-blue-700 transition-all duration-200 text-lg scale-100 hover:scale-105"
        onClick={onHome}
      >
        <span className="mr-2">🏠</span> Home
      </button>
    </div>
    <div className="mt-auto text-center text-blue-200 text-xs pt-8">
      &copy; {new Date().getFullYear()} Dairy Lift
    </div>
  </aside>
);

const TopNav = ({ onNavigate, currentPath, language, onLanguageChange, onHamburger }: {
  onNavigate: (path: string) => void;
  currentPath: string;
  language: string;
  onLanguageChange: (lang: string) => void;
  onHamburger: () => void;
}) => (
  <nav className={topNavBg}>
    <div className="flex items-center gap-2">
      <HamburgerIcon onClick={onHamburger} />
      <img src="/dairy-lift-logo.png" alt="Dairy Lift Logo" className="h-20 w-28 mr-3 select-none align-middle transition-transform duration-300 hover:scale-110 hover:rotate-2 drop-shadow-lg" style={{ marginLeft: '-8px' }} />
      {topNavLinks.map(link => (
        <button
          key={link.path}
          className={`${navLinkStyle} ${currentPath === link.path ? "bg-blue-100" : ""} hidden sm:inline-block`}
          onClick={() => onNavigate(link.path)}
        >
          {link.label}
        </button>
      ))}
    </div>
    <div className="flex items-center gap-2">
      <select
        value={language}
        onChange={e => onLanguageChange(e.target.value)}
        className="border border-blue-300 rounded px-2 py-1 text-blue-700 focus:outline-none"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.label}</option>
        ))}
      </select>
      <CartSidebar />
    </div>
  </nav>
);

const HamburgerMenu = ({ onHome }: { onHome: () => void }) => (
  <div className={hamburgerBg}>
    <button onClick={onHome} className="font-bold">☰ Home</button>
  </div>
);

const DairyLiftHome: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [language, setLanguage] = React.useState("en");

  const handleHome = () => {
    setSidebarOpen(false);
    navigate("/dashboard");
  };
  const handleNavigate = (path: string) => {
    setSidebarOpen(false);
    navigate(path);
  };
  const handleLanguageChange = (lang: string) => setLanguage(lang);
  const handleHamburger = () => setSidebarOpen(true);
  const handleOverlayClick = () => setSidebarOpen(false);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className={`flex flex-col ${dairyLiftBg}`} style={{ minHeight: "100vh" }}>
      <TopNav
        onNavigate={handleNavigate}
        currentPath={location.pathname}
        language={language}
        onLanguageChange={handleLanguageChange}
        onHamburger={handleHamburger}
      />
      <div className="flex flex-1">
        {/* Sidebar overlay for all devices */}
        {sidebarOpen && (
          <>
            <div className={overlayBg} onClick={handleOverlayClick} />
            <div className={`${sidebarBg} ${sidebarOpen ? sidebarOpen : sidebarClosed}`} style={{ minHeight: "100vh" }}>
              <Sidebar onHome={handleHome} onClose={handleSidebarClose} />
            </div>
          </>
        )}
        <main className="flex-1">
          <DairyLiftRoutes />
        </main>
      </div>
    </div>
  );
};

export default DairyLiftHome; 