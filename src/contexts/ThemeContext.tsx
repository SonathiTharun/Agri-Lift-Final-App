
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);
  const { user, updateProfile } = useAuth();

  // Initialize theme from user preferences or localStorage
  useEffect(() => {
    const initializeTheme = () => {
      let initialTheme: Theme = 'light';

      // First priority: user's saved preference
      if (user?.preferences?.theme) {
        initialTheme = user.preferences.theme as Theme;
      } else {
        // Second priority: localStorage (for non-authenticated users)
        const savedTheme = localStorage.getItem('agrilift-theme') as Theme;
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          initialTheme = savedTheme;
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          // Third priority: system preference
          initialTheme = 'dark';
        }
      }

      setThemeState(initialTheme);
      applyThemeToDocument(initialTheme);
      setIsLoading(false);
    };

    initializeTheme();
  }, [user]);

  // Apply theme to document
  const applyThemeToDocument = (newTheme: Theme) => {
    const root = document.documentElement;

    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Also set a data attribute for additional styling if needed
    root.setAttribute('data-theme', newTheme);
  };

  // Set theme function
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    applyThemeToDocument(newTheme);

    // Save to localStorage immediately
    localStorage.setItem('agrilift-theme', newTheme);

    // If user is authenticated, update their profile
    if (user) {
      try {
        await updateProfile({
          preferences: {
            ...user.preferences,
            theme: newTheme
          }
        });
      } catch (error) {
        console.error('Failed to save theme preference to profile:', error);
        // Theme change still works locally even if profile update fails
      }
    }
  };

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
