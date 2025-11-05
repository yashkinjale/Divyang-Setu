import React from 'react';

// Create a Theme Context
export const ThemeContext = React.createContext();

export const useThemeToggle = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeToggle must be used within ThemeProvider');
  }
  return context;
};