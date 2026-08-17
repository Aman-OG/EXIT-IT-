import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from '../api/axios';

export const ThemeContext = createContext();

const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const getInitialTheme = () => {
  const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('exitit-theme') : null;
  if (savedTheme) {
    return savedTheme;
  }
  return getSystemTheme();
};

export const ThemeProvider = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);
  const [theme, setThemeState] = useState(getInitialTheme); // light, dark, study, eye

  // Sync theme with user account settings or system default
  useEffect(() => {
    if (user && user.theme) {
      setThemeState(user.theme);
      localStorage.setItem('exitit-theme', user.theme);
    } else {
      const savedTheme = localStorage.getItem('exitit-theme');
      if (savedTheme) {
        setThemeState(savedTheme);
      } else {
        const sysTheme = getSystemTheme();
        setThemeState(sysTheme);
      }
    }
  }, [user]);

  // Listen for system theme changes if no manual override
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem('exitit-theme');
      // If user hasn't manually set a non-system theme in profile
      if (!user?.theme && !savedTheme) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [user]);

  // Apply theme class to HTML root element
  useEffect(() => {
    const html = document.documentElement;
    html.className = ''; // remove previous theme classes
    if (theme && theme !== 'light') {
      html.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('exitit-theme', newTheme);
    if (user) {
      try {
        await api.put('/users/theme', { theme: newTheme });
        setUser({ ...user, theme: newTheme });
      } catch (e) {
        console.error('Failed to save theme in DB', e);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
