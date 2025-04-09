'use client';
import React, { useState, useMemo, createContext, useContext, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getAppTheme } from '@/theme'; // Assuming theme.ts exports this
import type { PaletteMode, Theme } from '@mui/material';

// Define the shape of the context
interface ThemeModeContextType {
  mode: PaletteMode;
  toggleThemeMode: () => void;
}

// Create the context
const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

// Custom hook to use the theme mode context
export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (context === undefined) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
};

// Provider component
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // State for the theme mode, defaulting to 'light' or localStorage preference
  const [mode, setMode] = useState<PaletteMode>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('themeMode') as PaletteMode | null;
      if (savedMode) {
        return savedMode;
      }
      // Optionally, check system preference:
      // const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      // return prefersDarkMode ? 'dark' : 'light';
    }
    return 'light'; // Default to light if no preference found or on server
  });

  // Update localStorage when mode changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeMode', mode);
    }
  }, [mode]);

  // Function to toggle the theme mode
  const toggleThemeMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Memoize the theme based on the current mode
  const theme: Theme = useMemo(() => getAppTheme(mode), [mode]);

  // Memoize the context value
  const contextValue = useMemo(() => ({ mode, toggleThemeMode }), [mode]);

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
} 