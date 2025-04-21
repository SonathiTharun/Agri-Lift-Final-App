
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define all the languages and translations we support
export const translations = {
  en: {
    "home": "Home",
    "loans": "Loans",
    "contact": "Contact",
    "market": "Market",
    "labour": "Labour",
    "machinery": "Machinery",
    "export": "Export",
    "monitoring": "Monitoring",
    // Add more translations as needed
  },
  hi: {
    "home": "होम",
    "loans": "ऋण",
    "contact": "संपर्क",
    "market": "बाज़ार",
    "labour": "श्रम",
    "machinery": "मशीनरी",
    "export": "निर्यात",
    "monitoring": "निगरानी",
    // Add more translations as needed
  },
  ta: {
    "home": "முகப்பு",
    "loans": "கடன்கள்",
    "contact": "தொடர்பு",
    "market": "சந்தை",
    "labour": "தொழிலாளர்",
    "machinery": "இயந்திரங்கள்",
    "export": "ஏற்றுமதி",
    "monitoring": "கண்காணிப்பு",
    // Add more translations as needed
  },
  te: {
    "home": "హోమ్",
    "loans": "రుణాలు",
    "contact": "సంప్రదించండి",
    "market": "మార్కెట్",
    "labour": "కార్మికులు",
    "machinery": "యంత్రాలు",
    "export": "ఎగుమతి",
    "monitoring": "పర్యవేక్షణ",
    // Add more translations as needed
  }
};

// Define types for our context
type Language = 'en' | 'hi' | 'ta' | 'te';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

// Create provider component
export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  // Translation function
  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);
