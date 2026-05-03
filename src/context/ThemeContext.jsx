import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Theme Context
const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Apply theme to document
  const applyTheme = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.setAttribute('data-bs-theme', newTheme);
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: newTheme } 
    }));
  };

  // Set specific theme
  const setThemeMode = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: newTheme } 
    }));
  };

  // Get current theme
  const getCurrentTheme = () => theme;

  // Check if dark mode
  const isDarkMode = () => theme === 'dark';

  const value = {
    theme,
    toggleTheme,
    setThemeMode,
    getCurrentTheme,
    isDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;