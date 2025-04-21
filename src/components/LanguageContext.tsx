import React, { createContext, useContext, useState, ReactNode } from 'react';

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
    "services": "Services",
    "service-title": "Our Services",
    "service-description": "Comprehensive agricultural solutions for modern farming"
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
    "services": "सेवाएं",
    "service-title": "हमारी सेवाएं",
    "service-description": "आधुनिक खेती के लिए व्यापक कृषि समाधान"
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
    "services": "சேவைகள்",
    "service-title": "எங்கள் சேவைகள்",
    "service-description": "நவீன விவசாயத்திற்கான விரிவான விவசாய தீர்வுகள்"
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
    "services": "సేవలు",
    "service-title": "మా సేవలు",
    "service-description": "ఆధునిక వ్యవసాయానికి సమగ్ర వ్యవసాయ పరిష్కారాలు"
  }
};

type Language = 'en' | 'hi' | 'ta' | 'te';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
