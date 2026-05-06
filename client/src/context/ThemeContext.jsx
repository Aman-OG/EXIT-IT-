import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from '../api/axios';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);
  const [theme, setThemeState] = useState('light'); // light, dark, study, eye

  // Sync theme with user state
  useEffect(() => {
    if (user && user.theme) {
      setThemeState(user.theme);
    } else {
      const savedTheme = localStorage.getItem('exitit-theme');
      if (savedTheme) {
        setThemeState(savedTheme);
      } else {
        // [System Detection] Default to OS preference if no profile/storage theme exists
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setThemeState(systemPreference);
        localStorage.setItem('exitit-theme', systemPreference);
      }
    }
  }, [user]);

  // Apply theme to HTML
  useEffect(() => {
    const html = document.documentElement;
    html.className = ''; // remove old
    if (theme !== 'light') {
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
