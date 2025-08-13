import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference, default to dark mode
    const saved = localStorage.getItem('theme');
    if (saved !== null) {
      return saved === 'dark';
    }
    // Check system preference if no saved preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    // Update CSS custom properties
    const root = document.documentElement;
    if (isDarkMode) {
      root.style.setProperty('--bg-primary', '#0F0F0F');
      root.style.setProperty('--bg-secondary', '#1A1A1A');
      root.style.setProperty('--bg-tertiary', '#2D2D2D');
      root.style.setProperty('--text-primary', '#F5F5F5');
      root.style.setProperty('--text-secondary', '#A3A3A3');
      root.style.setProperty('--border-color', '#404040');
      root.style.setProperty('--card-bg', 'rgba(45, 45, 45, 0.6)');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.4)');
    } else {
      root.style.setProperty('--bg-primary', '#FFFFFF');
      root.style.setProperty('--bg-secondary', '#F8F9FA');
      root.style.setProperty('--bg-tertiary', '#E9ECEF');
      root.style.setProperty('--text-primary', '#1A1A1A');
      root.style.setProperty('--text-secondary', '#6C757D');
      root.style.setProperty('--border-color', '#DEE2E6');
      root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
