import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'dark' | 'light' | 'neon' | 'ocean' | 'forest' | 'sunset';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  getThemeColors: () => {
    background: string;
    card: string;
    text: string;
    accent: string;
    button: string;
    border: string;
    primary: string;
    secondary: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeConfigs = {
  dark: {
    background: '#1a1a2e',
    card: 'rgba(255, 255, 255, 0.1)',
    text: '#ffffff',
    accent: '#fbbf24',
    button: '#3b82f6',
    border: 'rgba(255, 255, 255, 0.2)',
    primary: '#8b5cf6',
    secondary: '#06b6d4',
  },
  light: {
    background: '#f8fafc',
    card: 'rgba(255, 255, 255, 0.8)',
    text: '#1f2937',
    accent: '#3b82f6',
    button: '#3b82f6',
    border: '#e5e7eb',
    primary: '#8b5cf6',
    secondary: '#06b6d4',
  },
  neon: {
    background: '#000000',
    card: 'rgba(236, 72, 153, 0.1)',
    text: '#f1f5f9',
    accent: '#ec4899',
    button: '#ec4899',
    border: 'rgba(236, 72, 153, 0.3)',
    primary: '#06b6d4',
    secondary: '#8b5cf6',
  },
  ocean: {
    background: '#0c4a6e',
    card: 'rgba(6, 182, 212, 0.1)',
    text: '#e0f2fe',
    accent: '#06b6d4',
    button: '#06b6d4',
    border: 'rgba(6, 182, 212, 0.3)',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
  },
  forest: {
    background: '#14532d',
    card: 'rgba(34, 197, 94, 0.1)',
    text: '#f0fdf4',
    accent: '#22c55e',
    button: '#22c55e',
    border: 'rgba(34, 197, 94, 0.3)',
    primary: '#10b981',
    secondary: '#06b6d4',
  },
  sunset: {
    background: '#7c2d12',
    card: 'rgba(251, 146, 60, 0.1)',
    text: '#fff7ed',
    accent: '#f97316',
    button: '#f97316',
    border: 'rgba(251, 146, 60, 0.3)',
    primary: '#ec4899',
    secondary: '#fbbf24',
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Load theme from AsyncStorage on mount
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('ml-onramp-theme');
      if (savedTheme && themeConfigs[savedTheme as Theme]) {
        setTheme(savedTheme as Theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const handleSetTheme = async (newTheme: Theme) => {
    try {
      setTheme(newTheme);
      await AsyncStorage.setItem('ml-onramp-theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const getThemeColors = () => themeConfigs[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, getThemeColors }}>
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

