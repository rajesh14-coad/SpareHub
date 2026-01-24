import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('sparehub-theme') || 'dark';
  });

  const themes = [
    { id: 'light', name: 'Daylight', description: 'Clean and bright interface' },
    { id: 'dark', name: 'Night Drive', description: 'Deep blue and slate focus' },
    { id: 'onyx', name: 'Onyx', description: 'Pure black professional aesthetics' },
    { id: 'midnight-gold', name: 'Midnight Gold', description: 'Luxury obsidian with gold accents' },
    { id: 'pure', name: 'Pure', description: 'High-contrast monochrome white' },
    { id: 'electric-neon', name: 'Electric Neon', description: 'Cyberpunk glow energy' },
    { id: 'automotive', name: 'Emerald Circuit', description: 'Tech-focused green circuit UI' },
    { id: 'retro-garage', name: 'Retro Garage', description: 'Vintage racing heritage' },
  ];

  useEffect(() => {
    localStorage.setItem('sparehub-theme', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
