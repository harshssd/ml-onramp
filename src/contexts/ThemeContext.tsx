'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light' | 'neon' | 'ocean' | 'forest' | 'sunset';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  getThemeClasses: () => {
    background: string;
    card: string;
    text: string;
    accent: string;
    button: string;
    border: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeConfigs = {
  dark: {
    background: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900',
    card: 'bg-white/10 backdrop-blur-sm border-white/20',
    text: 'text-white',
    accent: 'from-yellow-400 to-orange-500',
    button: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
    border: 'border-white/20',
  },
  light: {
    background: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
    card: 'bg-white/80 backdrop-blur-sm border-gray-200',
    text: 'text-gray-900',
    accent: 'from-blue-500 to-purple-600',
    button: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
    border: 'border-gray-200',
  },
  neon: {
    background: 'bg-gradient-to-br from-black via-purple-900 to-pink-900',
    card: 'bg-black/40 backdrop-blur-sm border-pink-500/30',
    text: 'text-pink-100',
    accent: 'from-pink-400 to-cyan-400',
    button: 'bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600',
    border: 'border-pink-500/30',
  },
  ocean: {
    background: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900',
    card: 'bg-cyan-500/10 backdrop-blur-sm border-cyan-400/30',
    text: 'text-cyan-100',
    accent: 'from-cyan-400 to-blue-500',
    button: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700',
    border: 'border-cyan-400/30',
  },
  forest: {
    background: 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900',
    card: 'bg-green-500/10 backdrop-blur-sm border-green-400/30',
    text: 'text-green-100',
    accent: 'from-green-400 to-emerald-500',
    button: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
    border: 'border-green-400/30',
  },
  sunset: {
    background: 'bg-gradient-to-br from-orange-900 via-red-900 to-pink-900',
    card: 'bg-orange-500/10 backdrop-blur-sm border-orange-400/30',
    text: 'text-orange-100',
    accent: 'from-orange-400 to-pink-500',
    button: 'bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700',
    border: 'border-orange-400/30',
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('ml-onramp-theme') as Theme;
    if (savedTheme && themeConfigs[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('ml-onramp-theme', newTheme);
  };

  const getThemeClasses = () => themeConfigs[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, getThemeClasses }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
