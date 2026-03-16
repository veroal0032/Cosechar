'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext({ lang: null, setLang: () => {}, selectedSeason: 'verano', setSelectedSeason: () => {} });

export function LanguageProvider({ children }) {
  // null = still loading from localStorage
  const [lang, setLangState] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState('verano');

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    // '' means "not chosen yet" → will show onboarding
    setLangState(saved ?? '');
  }, []);

  function setLang(newLang) {
    localStorage.setItem('lang', newLang);
    setLangState(newLang);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, selectedSeason, setSelectedSeason }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
