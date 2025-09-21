'use client';

import { useState } from 'react';
import { useTheme, type Theme } from '@/contexts/ThemeContext';
import { Palette, Sun, Moon, Zap, Waves, TreePine, Sunset } from 'lucide-react';
import { Button } from '@/components/ui/button';

const themeOptions = [
  { id: 'dark' as Theme, name: 'Dark Quest', icon: Moon, description: 'Classic dark theme' },
  { id: 'light' as Theme, name: 'Light Mode', icon: Sun, description: 'Clean and bright' },
  { id: 'neon' as Theme, name: 'Neon Cyber', icon: Zap, description: 'Cyberpunk vibes' },
  { id: 'ocean' as Theme, name: 'Ocean Depths', icon: Waves, description: 'Deep blue waters' },
  { id: 'forest' as Theme, name: 'Forest Quest', icon: TreePine, description: 'Nature adventure' },
  { id: 'sunset' as Theme, name: 'Sunset Magic', icon: Sunset, description: 'Warm and cozy' },
];

export function ThemeSelector() {
  const { theme, setTheme, getThemeClasses } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = themeOptions.find(t => t.id === theme);
  const themeClasses = getThemeClasses();

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className={`${themeClasses.border} ${themeClasses.text} hover:${themeClasses.card.replace('bg-', 'bg-').replace('/10', '/20')} border-2`}
      >
        <Palette className="h-4 w-4 mr-2" />
        {currentTheme?.name}
      </Button>

      {isOpen && (
        <div className={`absolute right-0 top-full mt-2 w-64 ${themeClasses.card} rounded-2xl p-4 border-2 ${themeClasses.border} z-50`}>
          <h3 className={`${themeClasses.text} font-bold text-lg mb-3`}>Choose Your Quest Theme</h3>
          <div className="grid grid-cols-1 gap-2">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    setTheme(option.id);
                    setIsOpen(false);
                  }}
                  className={`p-3 rounded-xl text-left transition-all duration-200 ${
                    isSelected 
                      ? `${themeClasses.card} border-2 ${themeClasses.border}` 
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${themeClasses.text}`} />
                    <div>
                      <div className={`${themeClasses.text} font-semibold`}>{option.name}</div>
                      <div className={`${themeClasses.text}/70 text-sm`}>{option.description}</div>
                    </div>
                    {isSelected && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
